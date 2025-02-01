import {useState, useEffect} from "react";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../../components/Loading";
import "./style.css";

const StatsByYear = () => {
    const [year, setYear] = useState("");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchStatsByYear = async (fetchYear) => {
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/teams/stats/${fetchYear}`);
            setStats(response);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to fetch stats. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatsByYear(2010);
    }, []);

    const handleFetch = () => {
        fetchStatsByYear(year);
    };

    return (<div className="stats-container">
        <h2 className="stats-header">Team Statistics</h2>
        <div className="stats-actions">
            <input
                type="number"
                placeholder="Enter Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <button
                className="btn btn-success"
                onClick={handleFetch}
                disabled={!year || loading}
            >
                {loading ? "Loading..." : "Fetch Stats"}
            </button>
        </div>
        {loading ? (<Loader/>) : error ? (<p className="error">{error}</p>) : stats ? (<div className="stats-card">
            <h3>Year {stats.year}</h3>
            <div className="stats-details">
                <div className="stat-item">
                    <p>Total Games Played</p>
                    <span>{stats.totalGamesPlayed}</span>
                </div>
                <div className="stat-item">
                    <p>Total Wins</p>
                    <span>{stats.totalWins}</span>
                </div>
                <div className="stat-item">
                    <p>Total Draws</p>
                    <span>{stats.totalDraws}</span>
                </div>
            </div>
        </div>) : (<p className="info-message">Enter a year to view statistics.</p>)}
    </div>);
};

export default StatsByYear;
