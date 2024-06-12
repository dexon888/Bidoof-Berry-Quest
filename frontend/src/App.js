import React, { useState } from 'react';
import Game from './components/Game';
import Score from './components/Score';
import GameOver from './components/GameOver';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleRestart = () => {
    setScore(0);
    setIsGameOver(false);
    // Logic to restart the game
  };

  return (
    <div className="App">
      {isGameOver ? (
        <GameOver score={score} onRestart={handleRestart} />
      ) : (
        <>
          <Score score={score} />
          <Game onGameOver={handleGameOver} onScoreUpdate={setScore} />
        </>
      )}
    </div>
  );
}

export default App;
