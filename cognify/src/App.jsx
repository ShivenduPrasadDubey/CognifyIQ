import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Feed from "./components/Feed";
import Speed from "./pages/Speed"; // Import your components
import Sequence from "./pages/Sequence";
import Number from "./pages/Number";
import Verbal from "./pages/Verbal";
import Leaderboard from "./pages/Leaderboard";
import PastScores from "./pages/PastScores";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Nav />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/speed" element={<Speed  />} />
        <Route path="/seq" element={<Sequence />} />
        <Route path="/number" element={<Number />} />
        <Route path="/verbal" element={<Verbal />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pastScores" element={<PastScores />} />
      </Routes>
    </div>
  );
}

export default App;
