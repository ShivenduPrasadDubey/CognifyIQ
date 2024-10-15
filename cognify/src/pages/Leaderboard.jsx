import React, { useState, useEffect } from 'react';
import axios from 'axios';

const gameTypes = ['NumberMemory', 'VisualMemory', 'Speed', 'VerbalMemory'];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('NumberMemory');
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`https://cognifyiq.onrender.com/api/leaderboard/${activeTab}`);
        setScores(response.data);
        console.log(scores);  
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchScores();
  }, [activeTab]);

  return (
    <div className="past-scores-container justify-center items-center rounded-md flex flex-col mx-auto">
    <h2 className="leaderboard-title text-md md:text-3xl text-orange-50 text-center mb-6">
      Leaderboard - Top 10 Global
    </h2>
    <div className="tabs gap-2 flex justify-center mb-6">
      {gameTypes.map((type) => (
        <button
          key={type}
          className={`tab-button bg-[#F5B1CC] px-2 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-lg font-medium ${activeTab === type ? 'bg-white text-[#F5B1CC]' : ' text-white hover:bg-gray-200'}`}
          onClick={() => setActiveTab(type)}
        >
          {type}
        </button>
      ))}
    </div>
    <div className="">
      <table className="text-center border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 bg-[#f3f4f6] text-[#29ac8c] text-xs">#</th>
            <th className="border px-4 py-2 bg-[#f3f4f6] text-[#29ac8c] text-xs">Name</th>
            <th className="border px-4 py-2 bg-[#f3f4f6] text-[#29ac8c] text-xs">Score</th>
            <th className="border px-4 py-2 bg-[#f3f4f6] text-[#29ac8c] text-xs">Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2 text-xs text-[#29ac8c]">{index + 1}</td>
              <td className="border px-4 py-2 text-xs text-[#29ac8c]">{score.userName}</td>
              <td className="border px-4 py-2 text-xs text-[#29ac8c]">{score.score} </td>
              <td className="border px-4 py-2 text-xs text-[#29ac8c]">{new Date(score.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default Leaderboard;
