import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import CandleChart from './CandleChart';
import Feedback from './Feedback';
import { getRandomPattern, CandlePattern, Candle } from '../utils/candlePatterns';
import { initSoundEffects, playCorrectSound, playWrongSound, playClickSound, toggleSound, isSoundEnabled } from '../utils/soundEffects';

interface GameProps {
  onScoreChange: (points: number) => void;
  onStreakChange: (streak: number) => void;
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const PredictionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const PredictionButton = styled.button<{ direction: 'up' | 'down' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48%;
  height: 80px;
  background-color: ${props => props.direction === 'up' ? '#2ecc71' : '#e74c3c'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.8rem;
  margin-bottom: 5px;
`;

const ButtonText = styled.span`
  font-size: 1rem;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const SoundButton = styled.button<{ isEnabled: boolean }>`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.isEnabled ? '#3498db' : '#95a5a6'};
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${props => props.isEnabled ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
  
  &:hover {
    color: ${props => props.isEnabled ? '#2980b9' : '#7f8c8d'};
    background-color: ${props => props.isEnabled ? 'rgba(52, 152, 219, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const SoundText = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
`;

const DifficultyIndicator = styled.div`
  display: flex;
  align-items: center;
`;

const DifficultyText = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-right: 5px;
`;

const DifficultyLevel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #3498db;
`;

const Game: React.FC<GameProps> = ({ onScoreChange, onStreakChange }) => {
  const [currentPattern, setCurrentPattern] = useState<CandlePattern | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [patternStartIndex, setPatternStartIndex] = useState(0); // Index where the actual pattern starts
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  const [soundOn, setSoundOn] = useState(true);
  
  const generateNewPattern = useCallback(() => {
    try {
      console.log('Generating new pattern with difficulty:', difficulty);
      const pattern = getRandomPattern(difficulty);
      console.log('Selected pattern:', pattern.name);
      
      // Generate pattern candles directly without context candles
      const patternCandles = pattern.generatePattern();
      
      // Ensure we have at least 15 candles by adding more if needed
      let allCandles = [...patternCandles];
      
      // If we have fewer than 15 candles, add more random candles
      if (allCandles.length < 15) {
        // Get the last candle's close price as a starting point
        let currentPrice = allCandles[allCandles.length - 1].close;
        
        // Add random candles until we have at least 15
        for (let i = allCandles.length; i < 15; i++) {
          // Random price movement
          const priceChange = Math.random() * 10 - 5; // Random change between -5 and 5
          const open = currentPrice;
          const close = currentPrice + priceChange;
          const high = Math.max(open, close) + Math.random() * 3;
          const low = Math.min(open, close) - Math.random() * 3;
          
          allCandles.push({
            open,
            high,
            low,
            close,
            color: close >= open ? 'green' : 'red'
          });
          
          currentPrice = close;
        }
      }
      
      // Validate candles
      const validCandles = allCandles.map(candle => {
        // Ensure high is the highest value
        const high = Math.max(candle.high, candle.open, candle.close);
        // Ensure low is the lowest value
        const low = Math.min(candle.low, candle.open, candle.close);
        // Ensure there's a reasonable range
        const adjustedHigh = high === low ? high + 5 : high;
        const adjustedLow = high === low ? low - 5 : low;
        
        return {
          ...candle,
          high: adjustedHigh,
          low: adjustedLow,
          color: candle.close >= candle.open ? 'green' : 'red'
        };
      });
      
      console.log('Generated pattern candles:', validCandles);
      console.log('Total number of candles:', validCandles.length);
      
      setCurrentPattern(pattern);
      setCandles(validCandles);
      setPatternStartIndex(0); // All candles are pattern candles
    } catch (error) {
      console.error('Error generating pattern:', error);
      // Fallback to a simple chart if there's an error
      const fallbackCandles = [];
      
      // Generate 15 random candles (all pattern candles)
      let currentPrice = 100;
      for (let i = 0; i < 15; i++) {
        const priceChange = Math.random() * 10 - 5; // Random change between -5 and 5
        const open = currentPrice;
        const close = currentPrice + priceChange;
        const high = Math.max(open, close) + Math.random() * 3;
        const low = Math.min(open, close) - Math.random() * 3;
        
        fallbackCandles.push({
          open,
          high,
          low,
          close,
          color: close >= open ? 'green' : 'red'
        });
        
        currentPrice = close;
      }
      
      setCandles(fallbackCandles);
      setPatternStartIndex(0); // All candles are pattern candles
    }
  }, [difficulty]);
  
  // Initialize the game
  useEffect(() => {
    console.log('Initializing game...');
    initSoundEffects();
    setSoundOn(isSoundEnabled());
    generateNewPattern();
    
    // Add a click handler to the document to help with audio initialization
    const handleInitialClick = () => {
      console.log('Initial user interaction detected');
      // Try to play a silent sound to unlock audio
      const audio = new Audio();
      audio.volume = 0;
      audio.play().catch(e => console.log('Silent audio play:', e));
    };
    
    document.addEventListener('click', handleInitialClick, { once: true });
    
    return () => {
      document.removeEventListener('click', handleInitialClick);
    };
  }, [generateNewPattern]);
  
  // Update difficulty based on streak
  useEffect(() => {
    if (streak >= 10) {
      setDifficulty(3);
    } else if (streak >= 5) {
      setDifficulty(2);
    } else {
      // Keep difficulty at 2 even for beginners to show multi-candle patterns
      setDifficulty(2);
    }
    
    onStreakChange(streak);
  }, [streak, onStreakChange]);
  
  const handlePrediction = (prediction: 'up' | 'down') => {
    playClickSound();
    
    if (!currentPattern) return;
    
    const isUserCorrect = prediction === currentPattern.expectedDirection;
    setIsCorrect(isUserCorrect);
    setShowFeedback(true);
    
    // Update streak
    if (isUserCorrect) {
      playCorrectSound();
      setStreak(prevStreak => prevStreak + 1);
      onScoreChange(10);
    } else {
      playWrongSound();
      setStreak(0);
      onScoreChange(-5);
    }
  };
  
  const handleFeedbackClose = () => {
    setShowFeedback(false);
    generateNewPattern();
  };
  
  const handleSoundToggle = () => {
    console.log('Sound toggle button clicked');
    const newSoundState = toggleSound();
    setSoundOn(newSoundState);
    
    // Try to play a sound immediately to test if it works
    if (newSoundState) {
      setTimeout(() => {
        playClickSound();
      }, 100);
    }
  };
  
  return (
    <GameContainer>
      <CandleChart 
        candles={candles} 
        patternStartIndex={patternStartIndex}
      />
      
      {!showFeedback ? (
        <PredictionButtons>
          <PredictionButton 
            direction="up" 
            onClick={() => handlePrediction('up')}
          >
            <ButtonIcon>↑</ButtonIcon>
            <ButtonText>UP</ButtonText>
          </PredictionButton>
          <PredictionButton 
            direction="down" 
            onClick={() => handlePrediction('down')}
          >
            <ButtonIcon>↓</ButtonIcon>
            <ButtonText>DOWN</ButtonText>
          </PredictionButton>
        </PredictionButtons>
      ) : (
        <Feedback 
          isCorrect={isCorrect} 
          pattern={currentPattern} 
          points={isCorrect ? 10 : -5}
          onClose={handleFeedbackClose} 
        />
      )}
      
      <GameControls>
        <SoundButton 
          isEnabled={soundOn} 
          onClick={handleSoundToggle}
        >
          {soundOn ? '🔊' : '🔇'}
          <SoundText>{soundOn ? 'Sound On' : 'Sound Off'}</SoundText>
        </SoundButton>
        <DifficultyIndicator>
          <DifficultyText>Difficulty:</DifficultyText>
          <DifficultyLevel>
            {difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard'}
          </DifficultyLevel>
        </DifficultyIndicator>
      </GameControls>
    </GameContainer>
  );
};

export default Game; 