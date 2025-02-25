import React, { useMemo } from 'react';
import styled from 'styled-components';
import Candlestick from './Candlestick';
import { Candle } from '../utils/candlePatterns';

interface CandleChartProps {
  candles: Candle[];
  patternStartIndex: number;
}

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 320px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 1px solid #eaeaea;
`;

const ChartTitle = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
`;

const ChartContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 10px 5px 10px 40px; /* Added left padding for price labels */
  border: 1px solid #eee;
`;

const GridLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
`;

const GridLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
`;

const PriceLabels = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0;
`;

const PriceLabel = styled.div`
  font-size: 10px;
  color: #666;
  text-align: right;
  padding-right: 5px;
`;

const CandlesContainer = styled.div`
  display: flex;
  width: 100%;
  height: 220px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const PatternIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 12px;
  color: #7f8c8d;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  font-size: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  border-radius: 2px;
`;

const CandleChart: React.FC<CandleChartProps> = ({ candles, patternStartIndex }) => {
  // Calculate price range for the chart - using empty array as fallback
  const prices = useMemo(() => {
    if (!candles || candles.length === 0) return [0, 100];
    return candles.flatMap(candle => [candle.high, candle.low]);
  }, [candles]);
  
  const priceRange = useMemo(() => {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { minPrice, maxPrice, range: maxPrice - minPrice };
  }, [prices]);
  
  // Create price labels
  const priceLabels = useMemo(() => {
    const labels = [];
    const steps = 5;
    
    for (let i = 0; i <= steps; i++) {
      const price = priceRange.maxPrice - (i / steps) * priceRange.range;
      labels.push(price.toFixed(2));
    }
    
    return labels;
  }, [priceRange]);

  // Ensure we have candles to display
  if (!candles || candles.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>Loading chart...</ChartTitle>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartTitle>
        Trading Chart
      </ChartTitle>
      
      <ChartContent>
        <GridLines>
          {priceLabels.map((_, i) => (
            <GridLine key={i} />
          ))}
        </GridLines>
        
        <PriceLabels>
          {priceLabels.map((price, i) => (
            <PriceLabel key={i}>{price}</PriceLabel>
          ))}
        </PriceLabels>
        
        <CandlesContainer>
          {candles.map((candle, index) => (
            <Candlestick
              key={index}
              candle={candle}
              width={30}
              height={200}
              index={index}
              totalCandles={candles.length}
              isPatternCandle={true} // All candles are pattern candles
            />
          ))}
        </CandlesContainer>
      </ChartContent>
      
      <Legend>
        <LegendItem>
          <LegendColor color="#2ecc71" />
          <span>Bullish</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#e74c3c" />
          <span>Bearish</span>
        </LegendItem>
      </Legend>
      
      <PatternIndicator>
        Showing {candles.length} candles
      </PatternIndicator>
    </ChartContainer>
  );
};

export default CandleChart; 