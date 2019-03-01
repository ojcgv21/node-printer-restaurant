const mysql = require('promise-mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

exports.connection = () => {
    return mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE_NAME,
        debug: false,
        dateStrings: true
    });
}