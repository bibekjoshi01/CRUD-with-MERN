import {useState} from "react";
import "./style.css";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../../components/Loading";

const TeamsByGoals = () => {
    const [teams, setTeams] = useState([]);
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTeamsByGoals = async () => {
        setError("");
        setLoading(true);
        try {
            if (!year || year.toString().length < 4) {
                setError("Please give valid year.");
                return;
            }
            const response = await axiosInstance.get(`/teams/averageGoals`, {params: {year}});
            setTeams(response.result || []);
        } catch (err) {
            setError(err?.response?.data || "Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (<div className="table-container">
        <h2 className="table-header">
            Teams with Average <span>Goals For</span> in {year}
        </h2>
        <div className="table-actions">
            <input
                type="text"
                placeholder="Enter Year (e.g. 2010)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <button className="btn btn-success" onClick={fetchTeamsByGoals}>
                Filter
            </button>
        </div>
        <div className="table">
            {loading ? (<Loader/>) : error ? (<p className="error">{error}</p>) : teams.length === 0 ? (
                <p>No teams to display.</p>) : (<table className="teams-table">
                <thead>
                <tr>
                    <th>Team Name</th>
                    <th>Games Played</th>
                    <th>Draw</th>
                    <th>Win</th>
                    <th>Loss</th>
                    <th>Goals For</th>
                    <th>Goal Against</th>
                    <th>Points</th>
                    <th>Year</th>
                    <th>Avg Goals For</th>
                </tr>
                </thead>
                <tbody>
                {teams.map((team, index) => (<tr key={index}>
                    <td>{team.team}</td>
                    <td>{team.gamesPlayed}</td>
                    <td>{team.draw}</td>
                    <td>{team.win}</td>
                    <td>{team.loss}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.points}</td>
                    <td>{team.year}</td>
                    <td>{team.averageGoalsFor}</td>
                </tr>))}
                </tbody>
            </table>)}
        </div>
    </div>);
};

export default TeamsByGoals;
