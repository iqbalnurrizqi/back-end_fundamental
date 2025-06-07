require("dotenv").config();
const express = require("express");
const app = express();
const albumRoutes = require("./src/routes/albums");
const songRoutes = require("./src/routes/songs");

// Get environment variables for server configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

app.use(express.json());

// Register routes
app.use("/albums", albumRoutes);
app.use("/songs", songRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  
  if (err.status === 400) {
    // Bad Request - Data validation error
    return res.status(400).json({ status: "fail", message: err.message });
  } else if (err.status === 404) {
    // Not Found - Resource not found
    return res.status(404).json({ status: "fail", message: err.message });
  } else {
    // Internal Server Error - Server error
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});