import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import "./style.css";
import axiosInstance from "../../utils/axiosInstance";
import Index from "../../components/Pagination";
import Loader from "../../components/Loading";
import AddTeamForm from "../../components/AddTeamForm";
import ConfirmationModal from "../../components/Confirmation";

const TeamCRUDTable = () => {
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // Rows per page
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [teamToUpdate, setTeamToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  // Fetch teams from the API
  const fetchTeams = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/teams`, {
        params: { page, limit: rowsPerPage, search: searchTerm },
      });
      setTeams(response?.teams || []);
      setTotalPages(response?.totalPages || 0);
      setCount(response?.count || 0);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to fetch data. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImportDataFromCSV = async () => {
    setImportLoading(true);
    try {
      const response = await axiosInstance.get("/import");
      toast.info(response || "Data Imported Successfully!");
      fetchTeams();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to fetch data. Please try again!";
      toast.error(errorMessage);
    } finally {
      setImportLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTeamAdded = async () => {
    setShowAddForm(false);
    await fetchTeams();
  };

  const handleOnClose = () => {
    setShowAddForm(false);
    if (isUpdate) {
      setTeamToUpdate(null);
      setIsUpdate(false);
    }
  };

  const handleUpdateClick = (teamId) => {
    const team = teams.find((t) => t._id === teamId); // Find the team by ID
    if (team) {
      setShowAddForm(true);
      setTeamToUpdate(team);
      setIsUpdate(true);
    }
  };

  const handleDeleteClick = (teamId) => {
    setTeamToDelete(teamId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/teams/delete/${teamToDelete}`);
      await fetchTeams();
      setShowModal(false); // Close the modal
      toast.success("Team deleted successfully!");
    } catch (err) {
      console.error("Error deleting team:", err);
      toast.error("Error deleting team. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTeamToDelete(null);
  };

  return (
    <div className="table-container">
      <h2 className="table-header">
        <span>Team</span> Management
      </h2>
      {showAddForm && (
        <AddTeamForm
          onClose={handleOnClose}
          onTeamAdded={handleTeamAdded}
          teamData={teamToUpdate}
          isUpdate={isUpdate}
          teamId={teamToUpdate?._id}
        />
      )}
      {!showAddForm &&
        (error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="table-actions">
              <input
                type="text"
                placeholder="Enter Team Name"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                value={searchTerm}
              />
              <button
                className="btn btn-success"
                onClick={() => fetchTeams(currentPage)}
              >
                Filter
              </button>
              <button
                className="btn btn-success"
                onClick={() => setShowAddForm(true)}
              >
                Add New Team
              </button>
            </div>

            <div className="table">
              {loading ? (
                <Loader />
              ) : teams?.length === 0 ? (
                <>
                  <p>No Data Available !</p>
                  <button
                    className="btn btn-info"
                    onClick={(e) => handleImportDataFromCSV()}
                  >
                    {importLoading ? "Importing..." : "Import Data From CSV"}
                  </button>
                </>
              ) : (
                <table className="teams-table">
                  <thead>
                    <tr>
                      <th>S.N</th>
                      <th>Team Name</th>
                      <th>Games Played</th>
                      <th>Draw</th>
                      <th>Win</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams?.map((team, index) => (
                      <tr key={team._id}>
                        <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                        <td>{team.team}</td>
                        <td>{team.gamesPlayed}</td>
                        <td>{team.draw}</td>
                        <td>{team.win}</td>
                        <td>
                          <button className="action-btn edit-btn" title="Edit">
                            <FaEdit
                              size={"20px"}
                              onClick={() => handleUpdateClick(team._id)}
                            />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Delete"
                          >
                            <MdDelete
                              size={"20px"}
                              onClick={() => handleDeleteClick(team._id)}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {teams?.length !== 0 && (
              <div className="table-pagination">
                <p>
                  Showing{" "}
                  <strong>{rowsPerPage < count ? rowsPerPage : count}</strong>{" "}
                  out of <strong>{count}</strong> entries
                </p>
                <div className="pagination">
                  <Index
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                  />
                </div>
              </div>
            )}
          </>
        ))}

      <ConfirmationModal
        showModal={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TeamCRUDTable;
