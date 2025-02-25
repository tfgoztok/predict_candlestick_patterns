import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import Header from './components/Header';
import Tutorial from './components/Tutorial';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const App: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // Load high score from localStorage if available
    const savedHighScore = localStorage.getItem('candleGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    // Save high score to localStorage when it changes
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('candleGameHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleScoreChange = (points: number) => {
    setScore(prevScore => {
      const newScore = prevScore + points;
      return newScore < 0 ? 0 : newScore;
    });
  };

  const handleStreakChange = (newStreak: number) => {
    setStreak(newStreak);
  };

  return (
    <AppContainer>
      <Header 
        score={score} 
        streak={streak} 
        highScore={highScore} 
        onTutorialToggle={() => setShowTutorial(true)} 
      />
      <Game 
        onScoreChange={handleScoreChange} 
        onStreakChange={handleStreakChange} 
      />
      {showTutorial && (
        <Tutorial onClose={() => setShowTutorial(false)} />
      )}
    </AppContainer>
  );
};

export default App; 