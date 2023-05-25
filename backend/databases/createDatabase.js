import db from "./connection.js";

const isDeleteMode = process.argv.findIndex((argument) => argument === "delete_mode") === -1 ? false : true;

if (isDeleteMode) {
    db.exec(`DROP TABLE users`);
}

// (DDL)
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password varchar(64) NOT NULL
)
`);

// Seeding (DML)
if (isDeleteMode) {
    db.exec(`INSERT INTO users (email, password) VALUES ('email', '$2b$12$DXlxfQ1dzEg4PEhFXv/IXuV6wHv4TFjiKRPCoPuVig1vYfCWPouwq')`);
}

