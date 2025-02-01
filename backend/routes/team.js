const express = require("express");

const router = express.Router();

const Team = require("../models/teamModel");

// Route to get all teams with pagination (GET)
router.get("/", async (req, res) => {
    try {
        const {page = 1, limit = 5, search = ""} = req.query;
        const pageNumber = parseInt(page);
        const pageLimit = parseInt(limit);

        // Build the search query
        const searchQuery = search ? {team: {$regex: search, $options: "i"}} : {};

        // Get the total count of matching documents
        const totalTeams = await Team.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalTeams / pageLimit);

        // Fetch the paginated and filtered teams
        const teams = await Team.find(searchQuery)
            .sort({createdAt: -1})
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);

        res.status(200).json({
            teams, totalPages, currentPage: pageNumber, count: totalTeams,
        });
    } catch (err) {
        console.error("Error fetching teams:", err);
        res.status(500).send("Error fetching teams!");
    }
});

// Route to get a team by name (GET)
router.get("/team/:id", async (req, res) => {
    const {teamName} = req.params;
    try {
        const team = await Team.findOne({team: teamName});
        if (!team) {
            return res.status(404).send("Team not found!");
        }
        res.status(200).json(team);
    } catch (err) {
        console.error("Error fetching team stats:", err);
        res.status(500).send("Error fetching team stats");
    }
});

// Route to add a new team
router.post("/add", async (req, res) => {
    const {
        team, gamesPlayed, win, draw, loss, goalsFor, goalsAgainst, points, year,
    } = req.body;

    if (!team || gamesPlayed == null || win == null || draw == null || loss == null || goalsFor == null || goalsAgainst == null || points == null || year == null) {
        return res.status(400).json({error: "All fields are required!"});
    }

    // Validate that the year is not greater than the current year
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
        return res
            .status(400)
            .json({error: `Year cannot be greater than ${currentYear}!`});
    }

    const newTeam = new Team({
        team, gamesPlayed, win, draw, loss, goalsFor, goalsAgainst, points, year,
    });

    try {
        await newTeam.save();
        res.status(201).send({
            message: "Team added successfully!",
        });
    } catch (err) {
        console.error("Error adding team:", err);
        res.status(500).send("Error adding team!");
    }
});

// update team route
router.put("/update/:id", async (req, res) => {
    const {id} = req.params;
    const {team, gamesPlayed, win, draw, loss, goalsFor, goalsAgainst, points, year} = req.body;

    // Validate input data
    if (gamesPlayed < 0 || win < 0 || draw < 0 || loss < 0 || goalsFor < 0 || goalsAgainst < 0 || points < 0) {
        return res.status(400).json({error: "Fields cannot be negative!"});
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        return res
            .status(400)
            .json({
                error: "Invalid year. It must be between 1900 and the current year.",
            });
    }

    try {
        const updatedTeam = await Team.findOneAndUpdate({_id: id}, {
            $set: {
                team, gamesPlayed, win, draw, loss, goalsFor, goalsAgainst, points, year,
            },
        }, {new: true});

        if (!updatedTeam) {
            return res.status(404).send("Team not found!");
        }
        res.status(200).json(updatedTeam);
    } catch (err) {
        console.error("Error updating team:", err);
        res.status(500).send("Error updating team. Please try again.");
    }
});

// Route to delete a team
router.delete("/delete/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const deletedTeam = await Team.findOneAndDelete({_id: id});
        if (!deletedTeam) {
            return res.status(404).send("Team not found!");
        }
        res.status(200).send("Team deleted successfully.");
    } catch (err) {
        console.error("Error deleting team:", err);
        res.status(500).send("Error deleting team!");
    }
});

// Route to get stats for a given year
router.get("/stats/:year", async (req, res) => {
    const {year} = req.params;

    // Validate the year parameter
    if (!year || isNaN(year)) {
        return res.status(400).json({error: "Invalid or missing year parameter."});
    }

    try {
        const teams = await Team.find({year: parseInt(year)}).select("gamesPlayed win draw");

        if (teams.length === 0) {
            return res.status(404).json({error: "No teams found for the given year."});
        }

        // Calculate totals
        const totalGames = teams.reduce((sum, team) => sum + team.gamesPlayed, 0);
        const totalWins = teams.reduce((sum, team) => sum + team.win, 0);
        const totalDraws = teams.reduce((sum, team) => sum + team.draw, 0);

        // Return the stats
        res.status(200).json({
            year: parseInt(year), totalGamesPlayed: totalGames, totalWins, totalDraws,
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({error: "Error fetching stats!"});
    }
});


// Route to filter teams with wins greater than a given value (limit 10)
router.get("/filter", async (req, res) => {
    const {winsGreaterThan} = req.query;

    if (!winsGreaterThan || isNaN(winsGreaterThan)) {
        return res
            .status(400)
            .send("Query parameter 'winsGreaterThan' must be a valid number.");
    }

    try {
        const teams = await Team.find({win: {$gt: parseInt(winsGreaterThan, 10)}})
            .limit(10)
            .exec();

        if (teams.length === 0) {
            return res
                .status(404)
                .send("No teams found with wins greater than the specified value.");
        }

        res.status(200).json({teams});
    } catch (err) {
        console.error("Error filtering teams:", err);
        res.status(500).send("Error filtering teams!");
    }
});

// Route to get teams with average goals for a given year
router.get("/averageGoals", async (req, res) => {
    const {year} = req.query;

    if (!year || isNaN(year)) {
        return res.status(400).send("Query parameter 'year' must be a valid number.");
    }

    try {
        const teams = await Team.find({year: parseInt(year, 10)});

        if (teams.length === 0) {
            return res.status(404).send("No teams found for the given year.");
        }

        const result = teams.map((team) => ({
            ...team.toObject(), // Include all columns from the team model
            averageGoalsFor: (team.goalsFor / team.gamesPlayed).toFixed(2), // Add average goals
        }));

        res.status(200).json({result});
    } catch (err) {
        console.error("Error fetching average goals:", err);
        res.status(500).send("Error fetching average goals!");
    }
});

module.exports = router;
