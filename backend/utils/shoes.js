import connection from "../databases/connection.js";
import fileStore from "./fileStore.js";

async function getShoeID(shoe) {
    let [ results ] = await connection.execute("SELECT (`ID`) FROM `sizer`.`shoes` WHERE `brand` = ? AND `name` = ? AND `size` = ?;", 
        [shoe.brand, shoe.name, shoe.size]);

    if (results.length === 1) {
        return results[0].ID;
    }
}

async function getAll() {
    const [ results ] = await connection.execute("SELECT s.id, s.brand, s.name, s.size, i.imageName " + 
                                                "FROM sizer.shoes s " + 
                                                "LEFT JOIN sizer.shoe_images i ON s.id = i.shoeID");

    const shoes = results.filter((value, index, array) => {
        if (index === 0) return true;

        const previous = array[index - 1];

        if (previous.id === value.id) {
            return false;
        } else {
            return true;
        }
    });

    return shoes;
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
            await connection.execute("INSERT INTO `sizer`.`shoe_images` (`shoeID`, `userID`, `imageName`) VALUES (?,?,?);", 
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

async function deleteImage(shoe, filename) {
    const shoeID = await getShoeID(shoe);

    await connection.execute("DELETE FROM `sizer`.`shoe_images` WHERE (`shoeID` = ? AND `imageName` = ?);", 
        [shoeID, filename]);

    fileStore.deleteShoeImage([shoe.brand, shoe.name, shoe.size], filename);
}

export default { create, uploadImages, getAll, getShoeImage, getShoeImages, deleteImage };