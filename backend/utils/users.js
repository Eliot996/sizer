import dotenv from "dotenv/config";
import bcrypt from "bcrypt";
import connection from "../databases/connection.js";
import fileStore from "./fileStore.js";

import mailer from "nodemailer";
/*
const transporter = mailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD
    }
  });
*/
const testAccount = await mailer.createTestAccount();
const transporter = mailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

const saltRounds = Number(process.env.SALT_ROUNDS);

async function create(email, password) {
    const encryptedPassword = bcrypt.hashSync(password, saltRounds);

    try {
        const [ results ] = await connection.execute("INSERT INTO users (email, password) VALUES (?, ?);", 
        [email, encryptedPassword]);

        const userID = results.insertId;

        sendCreateMail(email, password);
        return userID;
    } catch (error) {
        console.log(error)
    }
    
    return undefined;

}

function sendCreateMail(email, password) {
    transporter.sendMail({
            from: process.env.MAILER_USERNAME,
            to: email,
            subject: 'User created on authSite',
            text: `That was easy!\n\n Email: ${email}\n Password: ${password}`
        }, 
        function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }});
}

async function authenticate(email, password) {
    const [results] = await connection.execute("SELECT * FROM users WHERE email = ?;"
                      , [email]);
    const user = results[0]

    if (user) {
        if (bcrypt.compareSync(password, user.password)) 
            return user.id;
    }

    return undefined;
}

async function getProfileData(userID) {
  const [results] = await connection.execute("SELECT id, email FROM users WHERE id = ?;"
                              , [userID]);
  const user = results[0];
  if (user) {
    return user;
  } else {
    return undefined;
  }
}

async function updateEmail(userID, email) {
  const [results] = await connection.execute("UPDATE `sizer`.`users` SET `email` = ? WHERE (`id` = ?);"
                              , [email, userID]);
  return email;
}

async function updatePassword(userID, password, newPassword) {
  const profile = await getProfileData(userID);
  if (!profile) {
    return "not changed";
  }

  if (!await authenticate(profile.email, password)) {
    return "not changed";
  }

  const encryptedPassword = bcrypt.hashSync(newPassword, saltRounds);

  const [results] = await connection.execute("UPDATE `sizer`.`users` SET `password` = ? WHERE (`id` = ?);"
                              , [encryptedPassword, userID]);
  
  return true;
}

async function getImages(userID) {
  let [ results ] = await connection.execute("SELECT (`fileName`) FROM `sizer`.`foot_images` WHERE `userID` = ?", 
    [userID]);

    return results.map((elem) => elem.fileName);
}

async function getImage(userID, filename) {
  await fileStore.downloadFootImage(userID, filename);
}

async function uploadImages(userID, images) {
    images.forEach( async (image) => {
        const result = await fileStore.uploadFootImage(userID, image);

        if (result) {
            const [ results ] = await connection.execute("INSERT INTO `sizer`.`foot_images` (`userID`, `side`, `fileName`) VALUES (?, 'nope', ?);", 
            [userID, image.filename]);
        }
    });
    return true;
}

async function deleteImage(userID, filename) {
  let [ results ] = await connection.execute("DELETE FROM `sizer`.`foot_images` WHERE (`userID` = ? AND `fileName` = ?);", 
  [userID, filename]);

  await fileStore.deleteFootImage(userID, filename);
}


export default {
  create, 
  authenticate, 
  getProfileData, 
  updateEmail, 
  updatePassword, 
  getImages, 
  getImage,
  uploadImages,
  deleteImage
};