import db from "./connection.js";

// eslint-disable-next-line no-undef
const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;

if (isDeleteMode) {
    await db.query("DROP TABLE IF EXISTS `sizer`.`shoe_images`;");
    await db.query("DROP TABLE IF EXISTS `sizer`.`shoes`;");
    await db.query("DROP TABLE IF EXISTS `sizer`.`foot_images`;");
    await db.query("DROP TABLE IF EXISTS `sizer`.`users`;");
}

// (DDL)

// USERS
await db.query(`
CREATE TABLE \`sizer\`.\`users\` (
    \`id\` INT NOT NULL AUTO_INCREMENT,
    \`email\` VARCHAR(320) NOT NULL,
    \`password\` VARCHAR(64) NOT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE INDEX \`email_UNIQUE\` (\`email\` ASC) VISIBLE);
`);

// SHOES 
await db.query("CREATE TABLE `sizer`.`shoes` ( " + 
                "`id` INT NOT NULL AUTO_INCREMENT, " + 
                "`brand` VARCHAR(64) NOT NULL," + 
                "`name` VARCHAR(64) NOT NULL," + 
                "`size` INT NOT NULL," + 
                "PRIMARY KEY (`id`)," + 
                "UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);");

await db.query("ALTER TABLE `sizer`.`shoes` ADD UNIQUE `unique_index`(`brand`, `name`, `size`);");

await db.query("CREATE TABLE `sizer`.`shoe_images` (" + 
    "`id` INT NOT NULL AUTO_INCREMENT," + 
    "`shoeID` INT NOT NULL," + 
    "`userID` INT NOT NULL," + 
    "`imageName` VARCHAR(50) NOT NULL," + 
    "PRIMARY KEY (`id`)," + 
    "INDEX `ShoeID_idx` (`shoeID` ASC) VISIBLE," + 
    "INDEX `user_userID_idx` (`userID` ASC) VISIBLE," + 
    "CONSTRAINT `shoe_shoeID`" + 
    "  FOREIGN KEY (`shoeID`)" + 
    "  REFERENCES `sizer`.`shoes` (`id`)" + 
    "  ON DELETE NO ACTION" + 
    "  ON UPDATE NO ACTION," + 
    "CONSTRAINT `user_userID`" + 
    "  FOREIGN KEY (`userID`)" + 
    "  REFERENCES `sizer`.`users` (`id`)" + 
    "  ON DELETE NO ACTION" + 
    "  ON UPDATE NO ACTION);");

// FEET
await db.query("CREATE TABLE `sizer`.`foot_images` (" + 
    "`id` INT NOT NULL AUTO_INCREMENT," + 
    "`userID` INT NOT NULL," + 
    "`side` VARCHAR(5) NOT NULL," + 
    "`fileName` VARCHAR(50) NOT NULL," + 
    "PRIMARY KEY (`id`)," + 
    "INDEX `user_footID_idx` (`userID` ASC) VISIBLE," + 
    "CONSTRAINT `user_footID`" + 
    "  FOREIGN KEY (`userID`)" + 
    "  REFERENCES `sizer`.`users` (`id`)" + 
    "  ON DELETE NO ACTION" +
    "  ON UPDATE NO ACTION);");



// Seeding (DML)
if (isDeleteMode) {
    await db.query("INSERT INTO users (email, password) VALUES ('email', '$2b$12$DXlxfQ1dzEg4PEhFXv/IXuV6wHv4TFjiKRPCoPuVig1vYfCWPouwq')");
}

