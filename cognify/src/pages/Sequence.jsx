import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react"; 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Visual = () => {
  const [gridSize] = useState(5);
  const [gameSequence, setGameSequence] = useState([]); 
  const [userSequence, setUserSequence] = useState([]);
  const [flashingBlock, setFlashingBlock] = useState(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [clickedBlock, setClickedBlock] = useState(null);
  const { user } = useAuth0(); 
  const [scores, setScores] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const generateSequence = (level) => {
    const previousSequence = gameSequence;
    const newTile = Math.floor(Math.random() * gridSize * gridSize);
    return [...previousSequence, newTile];
  };

  useEffect(() => {
    if (!hasGameStarted || gameOver) return;
    const sequence = generateSequence(level);
    setGameSequence(sequence);
    setUserSequence([]);

    sequence.forEach((block, index) => {
      setTimeout(() => {
        setFlashingBlock(block);
        setTimeout(() => setFlashingBlock(null), 500);
      }, (index + 1) * 1000);
    });
  }, [level, gameOver, hasGameStarted]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get(`https://cognifyiq.onrender.com/api/leaderboard/VisualMemory`);
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
          label: 'Visual Memory Scores',
          data: scoreValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
      ],
    });
  };

  const handleClick = (index) => {
    if (gameOver || !hasGameStarted) return;
    setClickedBlock(index);
    setTimeout(() => setClickedBlock(null), 300);
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    for (let i = 0; i < newUserSequence.length; i++) {
      if (newUserSequence[i] !== gameSequence[i]) {
        saveScore(score);
        setGameOver(true);
        return;
      }
    }

    if (newUserSequence.length === gameSequence.length) {
      setScore((prevScore) => prevScore + 1);
      setLevel((prevLevel) => prevLevel + 1);
    }
  };

  const saveScore = async (finalScore) => {
    if(user){

      try {
        await axios.post('https://cognifyiq.onrender.com/api/score', {
          userName: user.nickname,
          gameType: 'VisualMemory',
          score: finalScore,
        });
        const response = await axios.get(`https://cognifyiq.onrender.com/api/leaderboard/VisualMemory`);
        setScores(response.data);
        updateChartData(response.data);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    else {
      console.log('User not logged in, score not saved.');
    }
  };

  const resetGame = () => {
    saveScore(score);
    setLevel(1);
    setScore(0);
    setGameOver(false);
    setGameSequence([]);
    setUserSequence([]);
    setFlashingBlock(null);
    setClickedBlock(null);
    setHasGameStarted(false);
    startGame();
  };

  const startGame = () => {
    setHasGameStarted(true);
    setGameOver(false);
    setLevel(1);
    setScore(0);
  };

  return (
    <div className='justify-center items-center rounded-md flex flex-col mx-auto gap-4 mt-20 md:mt-36'>
      <h2 className='md:text-3xl text-lg text-[#f0a45d]'>Visual Memory Game</h2>
      <h2 className='text-[#f0a45d] text-md'>Score: {score}</h2>

      {!hasGameStarted ? (
        <button className='bg-customOrange text-[#f0a45d]' onClick={startGame}>
          Click here to start
        </button>
      ) : gameOver ? (
        <div className='justify-center items-center rounded-md flex flex-col mx-auto gap-4'>
          <h3 className=''>Game Over! Final Score: {score}</h3>
          <button className='bg-customOrange text-[#f0a45d]' onClick={resetGame}>Restart</button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '10px',
            margin: '0 auto'
          }}
          className='mt-20'
        >
          {Array.from({ length: gridSize * gridSize }, (_, index) => {
            const backgroundColor =
              flashingBlock === index || clickedBlock === index
                ? '#f0ffff'
                : '#f0a45d';

            return (
              <div
                key={index}
                onClick={() => handleClick(index)}
                style={{
                  backgroundColor: backgroundColor,
                  border: `2px solid ${backgroundColor}`,
                  transition: 'background-color 0.3s, border-color 0.3s',
                  cursor: 'pointer'
                }}
                className='h-10 w-10'
              />
            );
          })}
        </div>
      )}

      <div className="space-y-10 h-52 w-8/12 flex justify-center mx-auto flex-col mt-10">
        <h3 className="text-center text-sm md:text-lg font-semibold text-[#f0a45d]">Visual Memory Score Statistics</h3>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default Visual;
