const mongoose = require('mongoose');

const userGameScoreSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  gameType: {
    type: String,
    enum: ['NumberMemory', 'VisualMemory', 'Speed', 'VerbalMemory'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserGameScore = mongoose.model('UserGameScore', userGameScoreSchema);

module.exports = UserGameScore;
