import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const gameTypes = ['NumberMemory', 'VisualMemory', 'Speed', 'VerbalMemory'];

const PastScores = () => {
  const { user, isAuthenticated } = useAuth0();
  const [activeTab, setActiveTab] = useState('NumberMemory');
  const [pastScores, setPastScores] = useState([]);
  const [loading, setLoading] = useState(false); // To handle loading state

  useEffect(() => {
    const fetchPastScores = async () => {
      if (isAuthenticated && user) {
        setLoading(true); // Start loading
        try {
          const response = await axios.get(
            `https://cognifyiq.onrender.com/api/past-scores/${activeTab}/${user.nickname}`
          );
          setPastScores(response.data);
        } catch (error) {
          console.error('Error fetching past scores:', error);
        } finally {
          setLoading(false); // End loading
        }
      }
    };

    fetchPastScores();
  }, [activeTab, isAuthenticated, user]);

  return (
    <div className="past-scores-container justify-center items-center rounded-md flex flex-col mx-auto">
      <h2 className="leaderboard-title text-md md:text-3xl text-orange-50 text-center mb-6">
        Past Scores - {user?.nickname}
      </h2>
      <div className="tabs gap-2 flex justify-center mb-6">
        {gameTypes.map((type) => (
          <button
            key={type}
            className={`tab-button bg-[#F5B1CC] px-2 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-lg font-medium ${
              activeTab === type ? 'bg-white text-[#F5B1CC]' : ' text-white hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div>
        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 bg-[#f3f4f6] text-[#29ac8c] text-xs">#</th>
              <th className="border px-4 py-2 bg-[#f3f4f6] text-[#29ac8c] text-xs">Score</th>
              <th className="border px-4 py-2 bg-[#f3f4f6] text-[#29ac8c] text-xs">Date</th>
            </tr>
          </thead>
          <tbody>
            {!isAuthenticated ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-xs">
                  Sign In to see your past scores for {activeTab}
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-xs">Loading...</td>
              </tr>
            ) : pastScores.length > 0 ? (
              pastScores.map((score, index) => (
                <tr key={score._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-xs text-[#29ac8c]">{index + 1}</td>
                  <td className="border px-4 py-2 text-xs text-[#29ac8c]">{score.score}</td>
                  <td className="border px-4 py-2 text-xs text-[#29ac8c]">{new Date(score.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-xs">
                  Play this game to see your past scores for {activeTab}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastScores;
