const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const connect = require("./db/connection");

require("./models/teamModel");

const footballRoutes = require("./routes/team");
const importRoutes = require("./routes/importData");

// Configure CORS options if needed
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type,Authorization", 
};

const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
// Use CORS middleware
app.use(cors(corsOptions));

app.use("/api/teams", footballRoutes);
app.use("/api/import", importRoutes);

const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
