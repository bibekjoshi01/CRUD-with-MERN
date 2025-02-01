import React from "react";
import "./Confirmation.css";

const ConfirmationModal = ({ showModal, onClose, onConfirm }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Are you sure you want to delete this team?</h3>
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
