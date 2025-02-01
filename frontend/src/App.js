import React from "react";
import "./App.css";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom Imports
import TeamCRUDTable from "./pages/TeamTable";
import TeamsByWins from "./pages/TeamsByWins";
import TeamsByGoals from "./pages/TeamsByGoals";
import StatsByYear from "./pages/StatsByYear";

const Navigation = () => {
    return (<nav className="navigation">
        <ul>
            <li><Link to="/">Manage Teams</Link></li>
            <li><Link to="/teams-by-win">Teams by Win</Link></li>
            <li><Link to="/teams-by-goals">Teams by Goals</Link></li>
            <li><Link to="/view-statistics">View Statistics</Link></li>
        </ul>
    </nav>);
};

const App = () => {
    return (<>
        <ToastContainer/>

        <Router>
            <Navigation/>

            <Routes>
                <Route path="/" element={<TeamCRUDTable/>}/>
                <Route path="/teams-by-win" element={<TeamsByWins/>}/>
                <Route path="/teams-by-goals" element={<TeamsByGoals/>}/>
                <Route path="/view-statistics" element={<StatsByYear/>}/>
            </Routes>
        </Router>
    </>);
};

export default App;
