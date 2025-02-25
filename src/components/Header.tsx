import React from 'react';
import styled from 'styled-components';

interface HeaderProps {
  score: number;
  streak: number;
  highScore: number;
  onTutorialToggle: () => void;
}

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ScoreBoard = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreLabel = styled.span`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 5px;
`;

const ScoreValue = styled.span<{ isStreak?: boolean }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.isStreak ? '#e74c3c' : '#2c3e50'};
`;

const HelpButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const Header: React.FC<HeaderProps> = ({ score, streak, highScore, onTutorialToggle }) => {
  return (
    <HeaderContainer>
      <Title>Candlestick Pattern Game</Title>
      <ScoreBoard>
        <ScoreItem>
          <ScoreLabel>SCORE</ScoreLabel>
          <ScoreValue>{score}</ScoreValue>
        </ScoreItem>
        <ScoreItem>
          <ScoreLabel>STREAK</ScoreLabel>
          <ScoreValue isStreak>{streak}🔥</ScoreValue>
        </ScoreItem>
        <ScoreItem>
          <ScoreLabel>HIGH SCORE</ScoreLabel>
          <ScoreValue>{highScore}</ScoreValue>
        </ScoreItem>
      </ScoreBoard>
      <HelpButton onClick={onTutorialToggle}>How to Play</HelpButton>
    </HeaderContainer>
  );
};

export default Header; 