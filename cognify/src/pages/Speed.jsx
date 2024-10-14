import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Speed = () => {
  const [boxColor, setBoxColor] = useState('bg-customOrange');
  const [message, setMessage] = useState('Click in the box to start');
  const [startTime, setStartTime] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [scores, setScores] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const timeoutRef = useRef(null);
  const { user } = useAuth0();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/leaderboard/Speed`); // Change endpoint to fetch scores
        setScores(response.data);
        updateChartData(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchScores();
  }, []); // Add empty dependency array to run once on mount

  const updateChartData = (data) => {
    const labels = data.map((score, index) => `Score ${index + 1}`);
    const scoreValues = data.map(score => score.score);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Reaction Times (ms)',
          data: scoreValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
      ],
    });
  };

  const handleClick = () => {
    if (isWaiting && !isStart) {
      setMessage('Clicked Too Soon');
      resetGame();
      return;
    }

    if (isWaiting) {
      setIsWaiting(false);
      setIsStart(false);
      const reactionDuration = Date.now() - startTime;
      setMessage(`Your reaction time is ${reactionDuration} ms! Click to restart`);
      setBoxColor('bg-customOrange');
      saveScore(reactionDuration); // Save the score when the game ends
      resetGame();
      return;
    }

    if (!startTime) {
      setMessage('Wait for green');
      setIsWaiting(true);
      const waitTime = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;

      timeoutRef.current = setTimeout(() => {
        setBoxColor('bg-green-500');
        setStartTime(Date.now());
        setIsStart(true);
        setMessage('Click!');
      }, waitTime);
    }
  };

  const resetGame = () => {
    setStartTime(null);
    setIsWaiting(false);
    setIsStart(false);
    clearTimeout(timeoutRef.current);
  };

  const saveScore = async (reactionDuration) => {
    if (user) {
      try {
        await axios.post('http://localhost:3000/api/score', {
          userName: user.nickname,
          gameType: 'Speed',
          score: reactionDuration,
        });
        console.log('Score saved successfully');
        // Fetch updated scores after saving
        const response = await axios.get(`http://localhost:3000/api/leaderboard/Speed`);
        setScores(response.data);
        updateChartData(response.data); // Update chart data after saving
      } catch (error) {
        console.error('Error saving score:', error);
      }
    } else {
      console.log('User not logged in, score not saved.');
    }
  };

  return (
    <div className='space-y-20 mt-20'>
      <div
        className={`flex items-center h-64 w-10/12 py-4 px-6 top-44 mx-auto rounded-md ${boxColor} transition-all cursor-pointer`}
        onClick={handleClick}
      >
        <h2 className="text-[#F5B1CC] text-sm md:text-2xl font-bold mx-auto text-center" style={{ whiteSpace: 'pre-line' }}>{message}</h2>
      </div>
      <h2 className='text-[#f0a45d] text-sm md:text-2xl flex w-10/12 top-28 justify-center text-center mx-auto rounded-md'>
        Click anywhere in the box when the box turns green to find out your reaction time!
      </h2>
      <div className="space-y-10 h-52 w-8/12 flex justify-center mx-auto flex-col">
        <h3 className="text-center text-sm md:text-lg font-semibold text-[#f0a45d]">Reaction Time Statistics</h3>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <div>

      </div>
    </div>
  );
};

export default Speed;
