import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { CandlePattern } from '../utils/candlePatterns';

interface FeedbackProps {
  isCorrect: boolean | null;
  pattern: CandlePattern | null;
  points: number;
  onClose: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FeedbackContainer = styled.div<{ isCorrect: boolean | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: ${props => 
    props.isCorrect === null ? '#f8f9fa' : 
    props.isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'
  };
  border: 2px solid ${props => 
    props.isCorrect === null ? '#dfe6e9' : 
    props.isCorrect ? '#2ecc71' : '#e74c3c'
  };
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ResultText = styled.h3<{ isCorrect: boolean | null }>`
  font-size: 1.5rem;
  color: ${props => 
    props.isCorrect === null ? '#7f8c8d' : 
    props.isCorrect ? '#27ae60' : '#c0392b'
  };
  margin: 0 0 10px 0;
`;

const PointsText = styled.p<{ isCorrect: boolean | null }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => 
    props.isCorrect === null ? '#7f8c8d' : 
    props.isCorrect ? '#27ae60' : '#c0392b'
  };
  margin: 0 0 15px 0;
`;

const PatternInfo = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  margin-bottom: 15px;
`;

const PatternName = styled.h4`
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 5px 0;
`;

const PatternDescription = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.4;
`;

const ContinueButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const Feedback: React.FC<FeedbackProps> = ({ isCorrect, pattern, points, onClose }) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <FeedbackContainer isCorrect={isCorrect}>
      {isCorrect !== null && (
        <>
          <ResultText isCorrect={isCorrect}>
            {isCorrect ? 'Correct!' : 'Wrong!'}
          </ResultText>
          <PointsText isCorrect={isCorrect}>
            {isCorrect ? `+${points}` : points}
          </PointsText>
        </>
      )}
      
      {pattern && (
        <PatternInfo>
          <PatternName>{pattern.name}</PatternName>
          <PatternDescription>{pattern.description}</PatternDescription>
        </PatternInfo>
      )}
      
      <ContinueButton onClick={onClose}>Continue</ContinueButton>
    </FeedbackContainer>
  );
};

export default Feedback; 