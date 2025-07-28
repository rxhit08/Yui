import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiOutlineXCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastSearchedQuery = useRef('');
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  // Load recent viewed profiles from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentProfiles')) || [];
    setRecentProfiles(stored);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        if (query !== lastSearchedQuery.current) {
          fetchResults(query);
          lastSearchedQuery.current = query;
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async (searchQuery) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/search/searchuser?q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const users = response.data.data || [];
      setResults(users.slice(0, 5));
    } catch (err) {
      setError('Failed to fetch results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setQuery('');
    setResults([]);
    setError('');
    lastSearchedQuery.current = '';
  };

  const handleProfileClick = (user) => {
    navigate(`/profile/${user.userName}`);

    setRecentProfiles((prev) => {
      const filtered = prev.filter((u) => u._id !== user._id);
      const updated = [user, ...filtered].slice(0, 5);
      localStorage.setItem('recentProfiles', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromRecent = (id) => {
    const updated = recentProfiles.filter((user) => user._id !== id);
    setRecentProfiles(updated);
    localStorage.setItem('recentProfiles', JSON.stringify(updated));
  };

  const SkeletonCard = () => (
    <div className="p-3 bg-gray-800 rounded-md flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-700 rounded-full" />
      <div className="flex flex-col gap-2 w-full">
        <div className="w-1/2 h-4 bg-gray-700 rounded" />
        <div className="w-1/3 h-3 bg-gray-700 rounded" />
      </div>
    </div>
  );

  return (
    <div className="h-128 overflow-hidden bg-black text-white flex items-start justify-center pt-10 px-4">
      <div className="w-full max-w-xl">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full p-3 border rounded-md focus:outline-none text-white pr-10"
          />
          {query && (
            <button
              onClick={clearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-red-500"
            >
              <HiOutlineXCircle size={20} />
            </button>
          )}
        </div>

        {!query && recentProfiles.length > 0 && (
          <div className="mt-4 rounded-md p-3">
            <ul className="space-y-2">
              {recentProfiles.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center hover:bg-gray-900 p-2 rounded-md"
                >
                  <div
                    onClick={() => handleProfileClick(user)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <img
                      src={user.avatar}
                      alt={user.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user.userName}</p>
                      <p className="text-sm text-gray-400">{user.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromRecent(user._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <HiOutlineXCircle size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Results */}
        <div className="mt-4 space-y-3 max-h-[calc(100vh-150px)] overflow-hidden">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : results.length > 0 ? (
            results.map((user) => (
              <div
                key={user._id}
                onClick={() => handleProfileClick(user)}
                className="pl-5 pt-2 flex items-center gap-4 cursor-pointer hover:bg-gray-800 rounded-md transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.userName}</p>
                  <p className="text-sm text-gray-400">{user.name}</p>
                </div>
              </div>
            ))
          ) : (
            query && !loading && <p className="text-gray-400">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
