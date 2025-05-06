import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

const SearchBar = ({ type, onResults, placeholder, onClear }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const performSearch = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      // Call onClear if provided, otherwise just clear results
      if (onClear) {
        onClear();
      } else {
        onResults([]);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search/${type}`,
        {
          params: { q: searchQuery },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Search response:", response.data);

      if (response.data.success) {
        onResults(response.data.data);
      } else {
        console.error("Search failed:", response.data.message);
        onResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      console.error("Error response:", error.response?.data);
      onResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    performSearch(query);
    return () => performSearch.cancel();
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || `Search ${type}...`}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
