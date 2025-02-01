import React, { useState } from "react";
import { toast } from "react-toastify";
import "./AddTeamForm.css";
import axiosInstance from "../utils/axiosInstance";

const AddTeamForm = ({ onClose, onTeamAdded, teamData, isUpdate, teamId }) => {
  const [formData, setFormData] = useState({
    team: teamData ? teamData.team : "",
    gamesPlayed: teamData ? teamData.gamesPlayed : "",
    win: teamData ? teamData.win : "",
    draw: teamData ? teamData.draw : "",
    loss: teamData ? teamData.loss : "",
    goalsFor: teamData ? teamData.goalsFor : "",
    goalsAgainst: teamData ? teamData.goalsAgainst : "",
    points: teamData ? teamData.points : "",
    year: teamData ? teamData.year : "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.team.trim() === "" ||
      formData.gamesPlayed === "" ||
      formData.win === "" ||
      formData.draw === "" ||
      formData.loss === "" ||
      formData.goalsFor === "" ||
      formData.goalsAgainst === "" ||
      formData.points === "" ||
      formData.year === ""
    ) {
      setError("All fields are required!");
      return;
    }

    const currentYear = new Date().getFullYear();

    if (formData.year < 1900 || formData.year > currentYear) {
      setError("Please enter a valid year.");
      return;
    }

    setLoading(true);

    try {
      if (isUpdate) {
        const response = await axiosInstance.put(
          `/teams/update/${teamId}`,
          formData
        );
        toast.success(response?.data?.message || "Team updated successfully!");
      } else {
        const response = await axiosInstance.post("/teams/add", formData);
        toast.success(response?.data?.message || "Team added successfully!");
      }
      onTeamAdded();
      onClose();
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
      toast.error(
        err?.response?.data?.error || "Error occurred. Please try again."
      );
    }
  };

  return (
    <div className="form-container">
      <h2>{isUpdate ? "Update Team" : "Add New Team"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Team Name</label>
        <input
          type="text"
          name="team"
          value={formData.team}
          onChange={handleChange}
          required
        />

        <div className="fields-row">
          <div>
            <label>Games Played:</label>
            <input
              type="number"
              name="gamesPlayed"
              value={formData.gamesPlayed}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Win</label>
            <input
              type="number"
              name="win"
              value={formData.win}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Draw</label>
            <input
              type="number"
              name="draw"
              value={formData.draw}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Loss</label>
            <input
              type="number"
              name="loss"
              value={formData.loss}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="fields-row">
          <div>
            <label>Goals For</label>
            <input
              type="number"
              name="goalsFor"
              value={formData.goalsFor}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Goals Against</label>
            <input
              type="number"
              name="goalsAgainst"
              value={formData.goalsAgainst}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Points</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        <div className="form-buttons">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading
              ? isUpdate
                ? "Updating..."
                : "Adding..."
              : isUpdate
              ? "Update Team"
              : "Add Team"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeamForm;
