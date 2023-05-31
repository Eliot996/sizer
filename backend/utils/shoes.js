import connection from "../databases/connection.js";

async function getShoeID(shoe) {
    let [ results ] = await connection.execute("SELECT (`ID`) FROM `sizer`.`shoes` WHERE `brand` = ? AND `name` = ? AND `size` = ?;", 
    [shoe.brand, shoe.name, shoe.size]);

    if (results.length === 1) {
        return results[0].ID;
    }
}

async function create(shoe) {
    const shoeID = getShoeID(shoe);

    if (shoeID) {
        return shoeID;
    }

    const [ results ] = await connection.execute("INSERT INTO `sizer`.`shoes` (`brand`, `name`, `size`) VALUES (?, ?, ?);", 
    [shoe.brand, shoe.name, shoe.size]); 

    return results.insertId;
}

export default {create}