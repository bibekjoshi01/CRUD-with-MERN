  const express = require("express");
  const fs = require("fs");
  const csv = require("csv-parser");

  const Team = require("../models/teamModel");

  const router = express.Router();

  // Import CSV data route
  router.get("", async (req, res) => {
    const results = [];

    fs.createReadStream("./data/FootbalCSV.csv")
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          team: row.Team,
          gamesPlayed: parseInt(row["Games Played"], 10),
          win: parseInt(row.Win, 10),
          draw: parseInt(row.Draw, 10),
          loss: parseInt(row.Loss, 10),
          goalsFor: parseInt(row["Goals For"], 10),
          goalsAgainst: parseInt(row["Goals Against"], 10),
          points: parseInt(row.Points, 10),
          year: parseInt(row.Year, 10),
        });
      })
      .on("end", async () => {
        try {
          await Team.insertMany(results);
          console.log("CSV data inserted successfully!");
          res.status(200).send("CSV data imported successfully!");
        } catch (err) {
          console.error("Error inserting data:", err);
          res.status(500).send("Error importing CSV data");
        }
      })
      .on("error", (err) => {
        console.error("Error reading CSV file:", err);
        res.status(500).send("Error reading CSV file");
      });
  });

  module.exports = router;
