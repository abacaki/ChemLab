import "dotenv/config";
import mysql from "mysql2";

const conexao = mysql.createConnection({
    host: process.envDB_HOST,
    port: Number(process.envDB_PORT),
    user: process.envDB_USER,
    password: process.envDB_PASSWORD,
    database: process.envDB_NAME,
});

export default conexao;