import dotenv from "dotenv/config";
import mysql from "mysql2/promise";

/*
const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
});
*/

const connection = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE_DB_NAME,
    password: process.env.DATABASE_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

//const [rows, fields] = await connection.execute("SELECT * FROM users;")
//console.log(rows);

export default connection;
