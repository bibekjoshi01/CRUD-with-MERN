import React from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import "./Pagination.css";

const Index = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisibleButtons = 5;

  // Calculate visible page numbers
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

  if (endPage - startPage < maxVisibleButtons - 1) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        <FaAngleLeft />
      </button>
      {pageNumbers?.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-btn ${currentPage === number ? "active" : ""}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        <FaAngleRight />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
};

export default Index;
