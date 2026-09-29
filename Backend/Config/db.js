import dotenv from "dotenv";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "scholarship_checker",
});

export const initializeDatabase = () =>
  new Promise((resolve, reject) => {
    db.connect((connectionError) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      console.log("✅ Database Connected");
      db.query(
        `CREATE TABLE IF NOT EXISTS scholarships (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          provider_type VARCHAR(50) NOT NULL DEFAULT 'Government',
          category TEXT NOT NULL,
          course_type TEXT NOT NULL,
          max_income DECIMAL(12, 2) NOT NULL,
          min_percentage DECIMAL(5, 2) NOT NULL,
          description TEXT NOT NULL,
          website VARCHAR(1024) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
        (schemaError) => {
          if (schemaError) {
            reject(schemaError);
            return;
          }

          console.log("✅ Scholarship database schema ready");
          resolve();
        }
      );
    });
  });

export default db;