const express = require("express");
const {sequelize} = require('./models/index')

const app = require('./app');
const PORT = 3000;

// // Middleware to parse JSON
app.use(express.json()); 


// Test DB connection
sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ Unable to connect to the database:", err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
