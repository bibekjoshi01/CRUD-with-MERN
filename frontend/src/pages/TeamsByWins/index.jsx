import {useState} from "react";
import "./style.css";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../../components/Loading";

const TeamsByWin = () => {
    const [teams, setTeams] = useState([]);
    const [winCount, setWinCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTeamsByWin = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/teams/filter?winsGreaterThan=${winCount || 0}`);
            setTeams(response?.teams || []);
        } catch (err) {
            setError(err?.response?.data || "Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (<div className="table-container">
        <h2 className="table-header">
            Teams with <span>Win Count</span> Greater than {winCount}
        </h2>
        <div className="table-actions">
            <input
                type="number"
                placeholder="Enter Win Count"
                value={winCount}
                onChange={(e) => setWinCount(e.target.value)}
            />
            <button className="btn btn-success" onClick={fetchTeamsByWin}>
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
                </tr>
                </thead>
                <tbody>
                {teams?.map((team, index) => (<tr key={index}>
                    <td>{team.team}</td>
                    <td>{team.gamesPlayed}</td>
                    <td>{team.draw}</td>
                    <td>{team.win}</td>
                    <td>{team.loss}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.points}</td>
                    <td>{team.year}</td>
                </tr>))}
                </tbody>
            </table>)}
        </div>
    </div>);
};

export default TeamsByWin;
