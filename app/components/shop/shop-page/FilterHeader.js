/* eslint-disable react/prop-types */
"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone } from 'react-icons/fa';
import VoiceSearch from '../../common/VoiceSearch/VoiceSearch';

export default function FilterHeader({
  onFilterChange,
  onSearchChange,
  searchTerm,
  suggestions,
  isSuggestionsLoading,
  suggestionsError,
  filter
}) {
  const options = [
    { label: "Default", value: "default" },
    { label: "High to Low", value: "price-desc" },
    { label: "Low to High", value: "price-asc" },
    { label: "New Arrival", value: "recent" },
  ];

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    onFilterChange(selectedFilter);
  };

  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    setLocalSearch(searchValue);
    onSearchChange(searchValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalSearch(suggestion);
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="w-full md:w-auto">
          <p className="text-sm text-gray-600">
            Showing 1-12 of <span className="font-semibold text-gray-900">15</span> results
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-96" ref={suggestionsRef}>
            <input
              type="text"
              placeholder="Search Something..."
              value={localSearch}
              onChange={handleSearchInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
            />
            <button
              type="button"
              onClick={() => setIsVoiceSearchOpen(true)}
              className="voice-btn position-absolute"
              style={{
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              <FaMicrophone />
            </button>
            <img className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" src='/images/icon/search.svg' alt="" />

            {/* Suggestions Dropdown */}
            {showSuggestions && localSearch.trim() !== "" && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
                {isSuggestionsLoading && (
                  <li className="px-4 py-2 text-gray-500">Loading...</li>
                )}
                {suggestionsError && (
                  <li className="px-4 py-2 text-red-500">{suggestionsError}</li>
                )}
                {!isSuggestionsLoading && suggestions.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">No suggestions found.</li>
                )}
                {!isSuggestionsLoading &&
                  suggestions.map((suggestion, index) => (
                    <div className="flex items-center px-2" key={index}>
                      <img className=" w-4 h-4" src='/images/icon/search.svg' alt="" />
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    </div>
                  ))}
              </ul>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Image
                width={14}
                height={10}
                className="mr-2"
                src="/images/icon/filter-icon.svg"
                alt="filter-icon"
              />
              Filters
            </button>
            <div className="relative w-full sm:w-auto">
              {/* Filter dropdown */}
              <select
                value={filter}
                onChange={handleFilterChange}
                className="w-full sm:w-48 pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <VoiceSearch
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={(transcript) => {
          setLocalSearch(transcript);
          onSearchChange(transcript);
        }}
      />
    </div>
  );
}
