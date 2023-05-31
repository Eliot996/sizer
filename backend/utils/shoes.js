import connection from "../databases/connection.js";
import fileStore from "./fileStore.js";

async function getShoeID(shoe) {
    let [ results ] = await connection.execute("SELECT (`ID`) FROM `sizer`.`shoes` WHERE `brand` = ? AND `name` = ? AND `size` = ?;", 
    [shoe.brand, shoe.name, shoe.size]);

    if (results.length === 1) {
        return results[0].ID;
    }
}

async function create(shoe) {
    const shoeID = await getShoeID(shoe);

    if (shoeID) {
        return shoeID;
    }

    const [ results ] = await connection.execute("INSERT INTO `sizer`.`shoes` (`brand`, `name`, `size`) VALUES (?, ?, ?);", 
    [shoe.brand, shoe.name, shoe.size]); 

    return results.insertId;
}

async function uploadImages(shoe, userID, images) {
    const shoeID = await getShoeID(shoe);

    images.forEach( async (image) => {
        const result = await fileStore.uploadShoeImage([shoe.brand, shoe.name, shoe.size], image);

        if (result) {
            const [ results ] = await connection.execute("INSERT INTO `sizer`.`shoe_images` (`shoeID`, `userID`, `imageName`) VALUES (?,?,?);", 
            [shoeID, userID, image.filename]);
        }
    });
    return true;
}

async function getShoeImages(shoe) {
    const shoeID = await getShoeID(shoe);
 
    let [ results ] = await connection.execute("SELECT (`imageName`) FROM `sizer`.`shoe_images` WHERE `shoeID` = ?", 
    [shoeID]);

    return results.map((elem) => elem.imageName);
}

async function getShoeImage(shoe, filename) {
    await fileStore.downloadShoeImage([shoe.brand, shoe.name, shoe.size], filename);
}

export default {create, uploadImages, getShoeImage, getShoeImages}