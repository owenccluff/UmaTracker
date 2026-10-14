const db = require("./db");

async function testConnection() {
  const [rows] = await db.query("SELECT 1");
  console.log("Database connected");
}

testConnection();