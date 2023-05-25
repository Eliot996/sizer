import dotenv from "dotenv/config";
import bcrypt from "bcrypt";
import connection from "../databases/connection.js";

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

export default {create, authenticate};