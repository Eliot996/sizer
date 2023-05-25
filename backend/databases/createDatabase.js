import db from "./connection.js";

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;

if (isDeleteMode) {
    await db.query('DROP TABLE IF EXISTS `sizer`.`users`;');
}

// (DDL)
await db.query(`
CREATE TABLE \`sizer\`.\`users\` (
    \`id\` INT NOT NULL AUTO_INCREMENT,
    \`email\` VARCHAR(320) NOT NULL,
    \`password\` VARCHAR(64) NOT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE INDEX \`email_UNIQUE\` (\`email\` ASC) VISIBLE);
`);

// Seeding (DML)
if (isDeleteMode) {
    await db.query(`INSERT INTO users (email, password) VALUES ('email', '$2b$12$DXlxfQ1dzEg4PEhFXv/IXuV6wHv4TFjiKRPCoPuVig1vYfCWPouwq')`);
}

