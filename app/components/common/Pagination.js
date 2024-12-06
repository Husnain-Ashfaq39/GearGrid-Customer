"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
          role="button"
          style={{ cursor: "pointer" }}
        >
          <span className="page-link">{i}</span>
        </li>
      );
    }

    return pages;
  };

  return (
    <ul className="page_navigation">
      <li
        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
        role="button"
        style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
      >
        <span className="page-link">
          <FaChevronLeft />
        </span>
      </li>

      {renderPageNumbers()}

      <li
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={() => handlePageChange(currentPage + 1)}
        role="button"
        style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
      >
        <span className="page-link">
          <FaChevronRight />
        </span>
      </li>
    </ul>
  );
};

export default Pagination;
