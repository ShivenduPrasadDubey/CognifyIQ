const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const cors = require('cors');
require('dotenv').config();
const UserGameScore = require('./models/UserGameScore');

app.use(cors({
  origin: ['https://cognify-iq.vercel.app', 'http://localhost:3000']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Save new score
app.post('/api/score', async (req, res) => {
  try {
    const { userName, gameType, score } = req.body;
    const newScore = new UserGameScore({
      userName,
      gameType,
      score,
    });
    await newScore.save();
    res.status(201).json({ message: 'Score saved successfully', newScore });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Get top 10 scores for each game type
// Get top 10 scores for each game type
app.get('/api/leaderboard/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params;
    
    // Sorting logic: Highest first for most games, lowest first for 'Speed'
    const sortOrder = (gameType === 'Speed') ? 1 : -1; // Ascending for Speed, Descending for others
    
    const topScores = await UserGameScore.find({ gameType })
      .sort({ score: sortOrder })
      .limit(10)
      .exec();
      
    res.status(200).json(topScores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params;
    const topScores = await UserGameScore.find({ gameType });    
    res.status(200).json(topScores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get past scores for a specific user and game type
app.get('/api/past-scores/:gameType/:userName', async (req, res) => {
  try {
    const { gameType, userName } = req.params;
    const userScores = await UserGameScore.find({ gameType, userName })
      .sort({ date: -1 }) // Optional: Sort by most recent scores
      .exec();
    res.status(200).json(userScores);
  } catch (error) {
    console.error('Error fetching past scores:', error);
    res.status(500).json({ error: 'Failed to fetch past scores' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
