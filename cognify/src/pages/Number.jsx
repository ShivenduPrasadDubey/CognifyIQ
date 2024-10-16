import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const NumberMemoryGame = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [timerWidth, setTimerWidth] = useState(100);
  const [timeLeft, setTimeLeft] = useState(6);
  
  const inputRef = useRef(null); // Ref for the input field
  const { user } = useAuth0(); // Get the current user from Auth0

  // Chart Data State
  const [scores, setScores] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const generateNumber = (level) => Math.floor(Math.random() * (10 ** level - 10 ** (level - 1))) + 10 ** (level - 1);

  useEffect(() => {
    if (!hasGameStarted || gameOver) return;
    const number = generateNumber(level);
    setCurrentNumber(number.toString());
    setInputValue('');
    setTimeLeft(6);
    setTimerWidth(100);

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setTimerWidth((prev) => prev - (100 / 6));
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(timerInterval);
      setTimeLeft(0);
    }, 6000);

    return () => {
      clearTimeout(timeout);
      clearInterval(timerInterval);
    };
  }, [level, gameOver, hasGameStarted]);

  useEffect(() => {
    if (timeLeft === 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [timeLeft]);

  // Fetch leaderboard scores for Number Memory Game
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`https://cognifyiq.onrender.com/api/leaderboard/NumberMemory`);
        setScores(response.data);
        updateChartData(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchScores();
  }, []);

  const updateChartData = (data) => {
    const labels = data.map((score, index) => `Score ${index + 1}`);
    const scoreValues = data.map(score => score.score);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Number Memory Scores',
          data: scoreValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
      ],
    });
  };

  const handleSubmit = () => {
    if (inputValue === currentNumber) {
      setScore(score + 1);
      setLevel(level + 1);
    } else {
      setGameOver(true);
      saveScore(score); // Save score when game is over
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setHasGameStarted(true); // Automatically start the game after resetting
    setCurrentNumber('');
    setInputValue('');
  };

  const startGame = () => {
    setHasGameStarted(true);
    setGameOver(false);
    setLevel(1);
    setScore(0);
  };

  const saveScore = async (finalScore) => {
    if(user){
      try {
        await axios.post('https://cognifyiq.onrender.com/api/score', {
          userName: user.nickname, // Save user's nickname
          gameType: 'NumberMemory', // Save game type
          score: finalScore, // Save the final score
        });
        console.log('Score saved successfully');
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    else {
      console.log('User not logged in, score not saved.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
      <div className='flex flex-col justify-center items-center rounded-md gap-4 mt-20 md:mt-36'>
        <h2 className='md:text-3xl text-lg text-[#f0a45d]'>Number Memory Game</h2>
        <h2 className='text-[#f0a45d]'>Score: {score}</h2>

        {!hasGameStarted ? (
          <button className='bg-customOrange text-[#f0a45d]' onClick={startGame}>
            Start Game
          </button>
        ) : gameOver ? (
          <div className='flex flex-col justify-center items-center'>
            <h3 className='mb-4'>Game Over! Final Score: {score}</h3>
            <button className='bg-customOrange text-[#f0a45d]' onClick={resetGame}>
              Restart
            </button>
          </div>
        ) : (
          <div className='mt-10'>
            <h3 className='text-lg md:text-2xl text-[#f0a45d] mb-6'>{timeLeft > 0 ? currentNumber : 'What was the number?'}</h3>
            {timeLeft === 0 && (
              <div className='flex flex-col gap-4 top-4'>
                <input
                  type='text'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={inputRef} // Set the ref to the input field
                  className='border-b-2 border-customOrange bg-transparent text-[#f0a45d] mb-4 focus:outline-none'
                  placeholder='Enter the number'
                />
                <button className='bg-customOrange text-[#f0a45d]' onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            )}
            {timeLeft > 0 && (
              <div
                className='mt-4 bg-[#f0a45d]'
                style={{ width: `${timerWidth}%`, height: '10px', transition: 'width 1s linear' }}
              ></div>
            )}
          </div>
        )}

        {/* Chart Section */}
        <div className="space-y-10 h-52 w-8/12 flex justify-center mx-auto flex-col mt-10">
          <h3 className="text-center text-sm md:text-lg font-semibold text-[#f0a45d]">Number Memory Score Statistics</h3>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
  );
};

export default NumberMemoryGame;
