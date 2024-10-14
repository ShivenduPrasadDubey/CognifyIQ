import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook

// Static list of 100 words
const WORDS_LIST = [
  "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew",
  "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry",
  "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yam", "zucchini",
  "apricot", "blueberry", "cantaloupe", "dragonfruit", "eggplant", "fennel", "garlic", "jalapeno",
  "kale", "lime", "melon", "nectar", "olive", "pumpkin", "quinoa", "radish",
  "spinach", "tomato", "turnip", "zucchini", "acorn", "beet", "cabbage", "daikon",
  "endive", "fava", "garbanzo", "hops", "Indian", "jackfruit", "kohlrabi", "leek",
  "mushroom", "nettle", "onion", "parsley", "quail", "rutabaga", "salsify", "tarragon",
  "upland", "vanilla", "wasabi", "yambean", "zest", "amber", "bronze", "copper",
  "diamond", "emerald", "fossil", "gem", "hematite", "ivory", "jade", "lapis",
  "moonstone", "onyx", "pearl", "quartz", "ruby", "sapphire", "topaz", "uranium",
  "violet", "water", "xenon", "yellow", "zinc", "alabaster", "brass", "clay",
  "dust", "earth", "flint", "glass", "honey", "iron", "jewel", "knot",
  "light", "moon", "night", "ocean", "pebble", "quicksand", "river", "stone",
  "tree", "umbrella", "valley", "wave", "xylophone", "yarn", "zebra"
];

const VerbalMemoryGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [seenWords, setSeenWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [isSameWord, setIsSameWord] = useState(false); // Track if the same word is shown
  const [animationClass, setAnimationClass] = useState(''); // Class for animation
  const { user } = useAuth0(); // Get the current user from Auth0

  // Function to get the next word, ensuring repetition every 5 words
  const getNextWord = () => {
    let word;

    if (usedWords.length >= 4 && usedWords.length % 5 === 4) {
      // Every 5th word should be a repeat
      word = usedWords[Math.floor(Math.random() * usedWords.length)];
    } else if (Math.random() < 0.4 && usedWords.length > 0) { // 40% chance to repeat
      word = usedWords[Math.floor(Math.random() * usedWords.length)];
    } else {
      // Fetch a new word from the predefined list that hasn't been used yet
      do {
        word = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
      } while (usedWords.includes(word));
    }

    return word;
  };

  // Move to the next round
  const nextRound = () => {
    const word = getNextWord();
    setIsSameWord(word === currentWord); // Check if the new word is the same as the current one
    setCurrentWord(word);
    setUsedWords((prev) => [...prev, word]);

    // Trigger animation
    setAnimationClass('fade-in');
    setTimeout(() => setAnimationClass(''), 300); // Remove animation class after duration
  };

  useEffect(() => {
    if (hasGameStarted) {
      nextRound(); // Start with the first word as soon as the game starts
    }
  }, [hasGameStarted]);

  const handleSeen = () => {
    if (seenWords.has(currentWord)) {
      setScore(score + 1);
    } else {
      saveScore(score); // Save score when game is over
      setGameOver(true);
    }
    nextRound();
  };

  const handleNew = () => {
    if (!seenWords.has(currentWord)) {
      setScore(score + 1);
      setSeenWords((prev) => new Set(prev).add(currentWord));
    } else {
      saveScore(score); // Save score when game is over
      setGameOver(true);
    }
    nextRound();
  };

  const saveScore = async (finalScore) => {
    if(user) {

      try {
        await axios.post('http://localhost:3000/api/score', {
          userName: user.nickname, // Save user's nickname
          gameType: 'VerbalMemory', // Specify game type
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

  const resetGame = () => {
    saveScore(score); // Save score when restarting
    setCurrentWord('');
    setUsedWords([]);
    setSeenWords(new Set());
    setScore(0);
    setGameOver(false);
    setHasGameStarted(true); // Automatically start the game on restart
    nextRound(); // Generate the first word immediately after reset
  };

  const startGame = () => {
    setHasGameStarted(true);
  };

  return (
      <div className='flex flex-col justify-center items-center rounded-md mt-20 md:mt-36'>
        <h2 className='text-lg md:text-3xl text-[#f0a45d] mb-4'>Verbal Memory Game</h2>
        <h2 className='text-[#f0a45d] mb-0'>Score: {score}</h2>

        {!hasGameStarted ? (
          <button className='bg-customOrange mt-4 text-[#f0a45d]' onClick={startGame}>
            Start New Game
          </button>
        ) : !gameOver ? (
          <div className='mt-10 flex flex-col items-center'>
            <h3 className={`text-lg md:text-2xl mb-6 text-[#f0a45d] ${animationClass}`}>
              {currentWord}
            </h3>
            <div className='flex'>
              <button className='bg-customOrange text-[#f0a45d] mr-4' onClick={handleSeen}>
                Seen
              </button>
              <button className='bg-customOrange text-[#f0a45d]' onClick={handleNew}>
                New
              </button>
            </div>
          </div>
        ) : (
          <div className='justify-center items-center rounded-md flex flex-col mx-auto'>
            <h3 className='mb-4 mt-4 text-[#f0a45d]'>Game Over! Final Score: {score}</h3>
            <button className='bg-customOrange text-[#f0a45d]' onClick={resetGame}>
              Restart
            </button>
          </div>
        )}
      </div>
  );
};

export default VerbalMemoryGame;
