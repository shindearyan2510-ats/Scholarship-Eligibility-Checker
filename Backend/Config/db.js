// File name: db.js
// Save at: Backend/Config/db.js

import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aryan008",   // ← change this to your actual MySQL password
  database: "scholarship_checker",    // ← matches the database created above
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database Connected (scholarship_checker)");
  }
});

export default db;