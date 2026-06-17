import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
// Create a connection pool for better performance
// console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "service_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;