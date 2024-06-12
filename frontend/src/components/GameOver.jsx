import React from 'react';

const gameOverStyle = {
  textAlign: 'center',
  marginTop: '100px',
};

const h1Style = {
  fontSize: '48px',
  color: '#ff0000',
};

const pStyle = {
  fontSize: '24px',
};

const buttonStyle = {
  fontSize: '24px',
  padding: '10px 20px',
  marginTop: '20px',
  cursor: 'pointer',
};

const GameOver = ({ score, onRestart }) => {
  return (
    <div style={gameOverStyle}>
      <h1 style={h1Style}>Game Over</h1>
      <p style={pStyle}>Final Score: {score}</p>
      <button style={buttonStyle} onClick={onRestart}>Restart</button>
    </div>
  );
};

export default GameOver;
