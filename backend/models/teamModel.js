const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    team: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [3, "Team name must be at least 3 characters long"],
    },
    gamesPlayed: {
      type: Number,
      required: [true, "Number of games played is required"],
      min: [0, "Games played cannot be negative"],
    },
    win: {
      type: Number,
      required: [true, "Number of wins is required"],
      min: [0, "Wins cannot be negative"],
    },
    draw: {
      type: Number,
      required: [true, "Number of draws is required"],
      min: [0, "Draws cannot be negative"],
    },
    loss: {
      type: Number,
      required: [true, "Number of losses is required"],
      min: [0, "Losses cannot be negative"],
    },
    goalsFor: {
      type: Number,
      required: [true, "Goals for is required"],
      min: [0, "Goals for cannot be negative"],
    },
    goalsAgainst: {
      type: Number,
      required: [true, "Goals against is required"],
      min: [0, "Goals against cannot be negative"],
    },
    points: {
      type: Number,
      required: [true, "Points are required"],
      min: [0, "Points cannot be negative"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1900, "Year cannot be earlier than 1900"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
  },
  {
    timestamps: true,
  }
);

// Create the model based on the schema
const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
