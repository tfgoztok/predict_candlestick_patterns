import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Candle } from '../utils/candlePatterns';

interface CandlestickProps {
  candle: Candle;
  width: number;
  height: number;
  index: number;
  totalCandles: number;
  isPatternCandle?: boolean;
}

interface CandleContainerProps {
  totalCandles: number;
  isPatternCandle?: boolean;
}

const CandleContainer = styled.div<CandleContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  flex: 1;
  ${props => props.isPatternCandle ? `
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 4px;
      background-color: rgba(52, 152, 219, 0.05);
      z-index: -1;
    }
  ` : ''}
`;

// Upper and lower wicks
const CandleWick = styled.div`
  width: 1px;
  background-color: #555;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

interface CandleBodyProps {
  totalCandles: number;
  color: string;
  isPatternCandle?: boolean;
}

const CandleBody = styled.div<CandleBodyProps>`
  width: ${props => {
    // Adjust width based on number of candles
    if (props.totalCandles <= 5) return '60%';
    if (props.totalCandles <= 10) return '50%';
    if (props.totalCandles <= 15) return '40%';
    return '30%';
  }};
  position: absolute;
  border-radius: 2px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.color};
  ${props => props.isPatternCandle ? `
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  ` : ''}
`;

const CandleNumber = styled.div`
  position: absolute;
  bottom: -15px;
  font-size: 8px;
  color: #3498db;
  display: none;
`;

const PriceLabel = styled.div`
  position: absolute;
  right: -40px;
  font-size: 8px;
  color: #7f8c8d;
  display: none;
`;

const Candlestick: React.FC<CandlestickProps> = ({ 
  candle, 
  width, 
  height, 
  index, 
  totalCandles,
  isPatternCandle = false
}) => {
  useEffect(() => {
    // Log candle data for debugging
    console.log(`Rendering candle ${index} of ${totalCandles}:`, candle);
  }, [candle, index, totalCandles, isPatternCandle]);
  
  // Prevent division by zero
  if (candle.high === candle.low) {
    console.warn('Invalid candle data: high equals low');
    return (
      <CandleContainer totalCandles={totalCandles} isPatternCandle={isPatternCandle}>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#7f8c8d' }}>
          Invalid
        </div>
      </CandleContainer>
    );
  }
  
  // Calculate the scale for rendering
  const chartHeight = height;
  const priceRange = candle.high - candle.low;
  const pixelsPerPrice = chartHeight / priceRange;
  
  // Determine open and close positions
  const openPos = chartHeight - (candle.high - candle.open) * pixelsPerPrice;
  const closePos = chartHeight - (candle.high - candle.close) * pixelsPerPrice;
  
  // Determine body top and height
  const bodyTop = Math.min(openPos, closePos);
  const bodyBottom = Math.max(openPos, closePos);
  const bodyHeight = bodyBottom - bodyTop;
  
  // Determine wick positions
  const highPos = 0; // Top of chart (high price)
  const lowPos = chartHeight; // Bottom of chart (low price)
  
  // Determine color
  const color = candle.close >= candle.open ? '#2ecc71' : '#e74c3c';
  
  return (
    <CandleContainer totalCandles={totalCandles} isPatternCandle={isPatternCandle}>
      {/* Upper wick - from top of body to high */}
      {bodyTop > highPos && (
        <CandleWick 
          style={{
            top: highPos,
            height: bodyTop - highPos,
          }}
        />
      )}
      
      {/* Lower wick - from bottom of body to low */}
      {lowPos > bodyBottom && (
        <CandleWick 
          style={{
            top: bodyBottom,
            height: lowPos - bodyBottom,
          }}
        />
      )}
      
      {/* Candle body */}
      <CandleBody 
        totalCandles={totalCandles}
        color={color}
        isPatternCandle={isPatternCandle}
        style={{
          top: bodyTop,
          height: Math.max(bodyHeight, 2), // Ensure at least 2px height
        }}
      />
      
      {/* Price labels (hidden by default) */}
      <PriceLabel style={{ top: highPos }}>{candle.high.toFixed(2)}</PriceLabel>
      <PriceLabel style={{ top: lowPos }}>{candle.low.toFixed(2)}</PriceLabel>
      
      {/* Display candle number (hidden by default) */}
      <CandleNumber>{index + 1}</CandleNumber>
    </CandleContainer>
  );
};

export default Candlestick; 