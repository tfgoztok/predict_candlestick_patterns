import React from 'react';
import styled from 'styled-components';

interface TutorialProps {
  onClose: () => void;
}

const TutorialOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const TutorialContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const TutorialTitle = styled.h2`
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
`;

const TutorialSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: #3498db;
  margin-bottom: 10px;
`;

const PatternExample = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
`;

const PatternName = styled.span`
  font-weight: 600;
  margin-right: 10px;
  min-width: 100px;
`;

const PatternDescription = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

const CloseButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  margin: 20px auto 0;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  return (
    <TutorialOverlay onClick={onClose}>
      <TutorialContainer onClick={(e) => e.stopPropagation()}>
        <TutorialTitle>How to Play</TutorialTitle>
        
        <TutorialSection>
          <SectionTitle>Game Rules</SectionTitle>
          <ul>
            <li>A candlestick pattern will appear on the screen</li>
            <li>Predict if the price will go UP or DOWN based on the pattern</li>
            <li>Tap/click the UP button if you think the price will rise</li>
            <li>Tap/click the DOWN button if you think the price will fall</li>
            <li>Correct predictions: +10 points</li>
            <li>Wrong predictions: -5 points</li>
            <li>Build a streak of correct predictions to unlock more patterns!</li>
          </ul>
        </TutorialSection>
        
        <TutorialSection>
          <SectionTitle>Basic Patterns</SectionTitle>
          
          <PatternExample>
            <PatternName>Doji</PatternName>
            <PatternDescription>Open and close prices are very close, showing market indecision</PatternDescription>
          </PatternExample>
          
          <PatternExample>
            <PatternName>Hammer</PatternName>
            <PatternDescription>Small body with a long lower shadow, typically a bullish reversal signal</PatternDescription>
          </PatternExample>
          
          <PatternExample>
            <PatternName>Engulfing</PatternName>
            <PatternDescription>A candle that completely engulfs the previous candle, strong reversal signal</PatternDescription>
          </PatternExample>
          
          <PatternExample>
            <PatternName>Shooting Star</PatternName>
            <PatternDescription>Small body with a long upper shadow, typically a bearish reversal signal</PatternDescription>
          </PatternExample>
        </TutorialSection>
        
        <CloseButton onClick={onClose}>Start Playing!</CloseButton>
      </TutorialContainer>
    </TutorialOverlay>
  );
};

export default Tutorial; 