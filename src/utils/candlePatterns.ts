// Types for candlestick data
export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  color: string; // 'green' or 'red'
}

export interface CandlePattern {
  id: string;
  name: string;
  description: string;
  expectedDirection: 'up' | 'down';
  difficulty: 1 | 2 | 3; // 1 = easy, 2 = medium, 3 = hard
  generatePattern: () => Candle[];
}

// Helper functions for generating random candle data
const getRandomNumber = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

const createCandle = (open: number, high: number, low: number, close: number): Candle => {
  return {
    open,
    high: Math.max(high, open, close),
    low: Math.min(low, open, close),
    close,
    color: close >= open ? 'green' : 'red'
  };
};

// Define candlestick patterns
export const candlePatterns: CandlePattern[] = [
  {
    id: 'doji',
    name: 'Doji',
    description: 'Open and close prices are very close, showing market indecision',
    expectedDirection: 'up', // Doji can go either way, but we'll default to up for simplicity
    difficulty: 1,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const shadowLength = getRandomNumber(5, 15);
      
      return [
        createCandle(
          basePrice,
          basePrice + shadowLength,
          basePrice - shadowLength,
          basePrice + getRandomNumber(-0.5, 0.5)
        )
      ];
    }
  },
  {
    id: 'hammer',
    name: 'Hammer',
    description: 'Small body with a long lower shadow, typically a bullish reversal signal',
    expectedDirection: 'up',
    difficulty: 1,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const bodySize = getRandomNumber(1, 3);
      const lowerShadow = getRandomNumber(10, 20);
      const upperShadow = getRandomNumber(0, 1);
      
      return [
        createCandle(
          basePrice,
          basePrice + bodySize + upperShadow,
          basePrice - lowerShadow,
          basePrice + bodySize
        )
      ];
    }
  },
  {
    id: 'shootingStar',
    name: 'Shooting Star',
    description: 'Small body with a long upper shadow, typically a bearish reversal signal',
    expectedDirection: 'down',
    difficulty: 1,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const bodySize = getRandomNumber(1, 3);
      const upperShadow = getRandomNumber(10, 20);
      const lowerShadow = getRandomNumber(0, 1);
      
      return [
        createCandle(
          basePrice,
          basePrice + upperShadow,
          basePrice - lowerShadow,
          basePrice - bodySize
        )
      ];
    }
  },
  {
    id: 'bullishEngulfing',
    name: 'Bullish Engulfing',
    description: 'A bullish candle that completely engulfs the previous bearish candle',
    expectedDirection: 'up',
    difficulty: 2,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const firstCandleBody = getRandomNumber(3, 7);
      const secondCandleBody = getRandomNumber(firstCandleBody + 2, firstCandleBody + 8);
      
      return [
        createCandle(
          basePrice + firstCandleBody,
          basePrice + firstCandleBody + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3),
          basePrice
        ),
        createCandle(
          basePrice - 1,
          basePrice + secondCandleBody + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3) - 1,
          basePrice + secondCandleBody
        )
      ];
    }
  },
  {
    id: 'bearishEngulfing',
    name: 'Bearish Engulfing',
    description: 'A bearish candle that completely engulfs the previous bullish candle',
    expectedDirection: 'down',
    difficulty: 2,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const firstCandleBody = getRandomNumber(3, 7);
      const secondCandleBody = getRandomNumber(firstCandleBody + 2, firstCandleBody + 8);
      
      return [
        createCandle(
          basePrice,
          basePrice + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3),
          basePrice + firstCandleBody
        ),
        createCandle(
          basePrice + firstCandleBody + 1,
          basePrice + firstCandleBody + getRandomNumber(1, 3) + 1,
          basePrice - getRandomNumber(1, 3) - secondCandleBody,
          basePrice - secondCandleBody
        )
      ];
    }
  },
  {
    id: 'morningstar',
    name: 'Morning Star',
    description: 'A three-candle pattern indicating a potential bullish reversal',
    expectedDirection: 'up',
    difficulty: 3,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const firstCandleBody = getRandomNumber(8, 15);
      const thirdCandleBody = getRandomNumber(5, 12);
      
      return [
        createCandle(
          basePrice + firstCandleBody,
          basePrice + firstCandleBody + getRandomNumber(1, 3),
          basePrice + getRandomNumber(0, 2),
          basePrice
        ),
        createCandle(
          basePrice - getRandomNumber(1, 3),
          basePrice + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3),
          basePrice - getRandomNumber(-1, 1)
        ),
        createCandle(
          basePrice,
          basePrice + thirdCandleBody + getRandomNumber(1, 3),
          basePrice - getRandomNumber(0, 2),
          basePrice + thirdCandleBody
        )
      ];
    }
  },
  {
    id: 'eveningstar',
    name: 'Evening Star',
    description: 'A three-candle pattern indicating a potential bearish reversal',
    expectedDirection: 'down',
    difficulty: 3,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const firstCandleBody = getRandomNumber(8, 15);
      const thirdCandleBody = getRandomNumber(5, 12);
      
      return [
        createCandle(
          basePrice,
          basePrice + firstCandleBody + getRandomNumber(1, 3),
          basePrice - getRandomNumber(0, 2),
          basePrice + firstCandleBody
        ),
        createCandle(
          basePrice + firstCandleBody + getRandomNumber(1, 3),
          basePrice + firstCandleBody + getRandomNumber(3, 5),
          basePrice + firstCandleBody + getRandomNumber(0, 2),
          basePrice + firstCandleBody + getRandomNumber(0, 2)
        ),
        createCandle(
          basePrice + firstCandleBody,
          basePrice + firstCandleBody + getRandomNumber(0, 2),
          basePrice - thirdCandleBody - getRandomNumber(0, 2),
          basePrice - thirdCandleBody
        )
      ];
    }
  },
  // New patterns
  {
    id: 'threeWhiteSoldiers',
    name: 'Three White Soldiers',
    description: 'Three consecutive bullish candles, each closing higher than the previous, indicating strong buying pressure',
    expectedDirection: 'up',
    difficulty: 3,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 180);
      const candles = [];
      let currentPrice = basePrice;
      
      for (let i = 0; i < 3; i++) {
        const bodySize = getRandomNumber(5, 10);
        const open = currentPrice;
        const close = open + bodySize;
        const high = close + getRandomNumber(0, 2);
        const low = open - getRandomNumber(0, 2);
        
        candles.push(createCandle(open, high, low, close));
        currentPrice = close;
      }
      
      return candles;
    }
  },
  {
    id: 'threeBlackCrows',
    name: 'Three Black Crows',
    description: 'Three consecutive bearish candles, each closing lower than the previous, indicating strong selling pressure',
    expectedDirection: 'down',
    difficulty: 3,
    generatePattern: () => {
      const basePrice = getRandomNumber(80, 200);
      const candles = [];
      let currentPrice = basePrice;
      
      for (let i = 0; i < 3; i++) {
        const bodySize = getRandomNumber(5, 10);
        const open = currentPrice;
        const close = open - bodySize;
        const high = open + getRandomNumber(0, 2);
        const low = close - getRandomNumber(0, 2);
        
        candles.push(createCandle(open, high, low, close));
        currentPrice = close;
      }
      
      return candles;
    }
  },
  {
    id: 'bullishHarami',
    name: 'Bullish Harami',
    description: 'A small bullish candle contained within the body of a previous larger bearish candle, indicating a potential reversal',
    expectedDirection: 'up',
    difficulty: 2,
    generatePattern: () => {
      const basePrice = getRandomNumber(60, 180);
      const firstCandleBody = getRandomNumber(10, 15);
      const secondCandleBody = getRandomNumber(2, 4);
      
      return [
        createCandle(
          basePrice + firstCandleBody,
          basePrice + firstCandleBody + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3),
          basePrice
        ),
        createCandle(
          basePrice + firstCandleBody / 3,
          basePrice + firstCandleBody / 3 + getRandomNumber(0, 1),
          basePrice + firstCandleBody / 3 - getRandomNumber(0, 1),
          basePrice + firstCandleBody / 3 + secondCandleBody
        )
      ];
    }
  },
  {
    id: 'bearishHarami',
    name: 'Bearish Harami',
    description: 'A small bearish candle contained within the body of a previous larger bullish candle, indicating a potential reversal',
    expectedDirection: 'down',
    difficulty: 2,
    generatePattern: () => {
      const basePrice = getRandomNumber(60, 180);
      const firstCandleBody = getRandomNumber(10, 15);
      const secondCandleBody = getRandomNumber(2, 4);
      
      return [
        createCandle(
          basePrice,
          basePrice + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3),
          basePrice + firstCandleBody
        ),
        createCandle(
          basePrice + 2 * firstCandleBody / 3,
          basePrice + 2 * firstCandleBody / 3 + getRandomNumber(0, 1),
          basePrice + 2 * firstCandleBody / 3 - getRandomNumber(0, 1),
          basePrice + 2 * firstCandleBody / 3 - secondCandleBody
        )
      ];
    }
  },
  {
    id: 'piercingLine',
    name: 'Piercing Line',
    description: 'A bullish candle that closes above the midpoint of the previous bearish candle, indicating a potential reversal',
    expectedDirection: 'up',
    difficulty: 2,
    generatePattern: () => {
      const basePrice = getRandomNumber(60, 180);
      const firstCandleBody = getRandomNumber(8, 12);
      const secondCandleBody = getRandomNumber(firstCandleBody/2 + 1, firstCandleBody - 1);
      
      return [
        createCandle(
          basePrice + firstCandleBody,
          basePrice + firstCandleBody + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3),
          basePrice
        ),
        createCandle(
          basePrice - getRandomNumber(1, 3),
          basePrice + secondCandleBody + getRandomNumber(1, 3),
          basePrice - getRandomNumber(3, 6),
          basePrice + secondCandleBody
        )
      ];
    }
  },
  {
    id: 'darkCloudCover',
    name: 'Dark Cloud Cover',
    description: 'A bearish candle that closes below the midpoint of the previous bullish candle, indicating a potential reversal',
    expectedDirection: 'down',
    difficulty: 2,
    generatePattern: () => {
      const basePrice = getRandomNumber(60, 180);
      const firstCandleBody = getRandomNumber(8, 12);
      const secondCandleBody = getRandomNumber(firstCandleBody/2 + 1, firstCandleBody - 1);
      
      return [
        createCandle(
          basePrice,
          basePrice + getRandomNumber(1, 3),
          basePrice - getRandomNumber(1, 3),
          basePrice + firstCandleBody
        ),
        createCandle(
          basePrice + firstCandleBody + getRandomNumber(1, 3),
          basePrice + firstCandleBody + getRandomNumber(3, 6),
          basePrice + firstCandleBody - secondCandleBody - getRandomNumber(1, 3),
          basePrice + firstCandleBody - secondCandleBody
        )
      ];
    }
  },
  {
    id: 'spinningTop',
    name: 'Spinning Top',
    description: 'A candle with a small body and long upper and lower shadows, indicating indecision in the market',
    expectedDirection: 'up', // Can go either way, but we'll default to up
    difficulty: 1,
    generatePattern: () => {
      const basePrice = getRandomNumber(50, 200);
      const bodySize = getRandomNumber(1, 2);
      const upperShadow = getRandomNumber(5, 10);
      const lowerShadow = getRandomNumber(5, 10);
      
      return [
        createCandle(
          basePrice,
          basePrice + bodySize + upperShadow,
          basePrice - lowerShadow,
          basePrice + bodySize
        )
      ];
    }
  }
];

// Function to generate context candles before the pattern
const generateContextCandles = (basePrice: number, count: number = 5): Candle[] => {
  const contextCandles: Candle[] = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < count; i++) {
    // Random price movement
    const priceChange = getRandomNumber(-5, 5);
    const open = currentPrice;
    const close = currentPrice + priceChange;
    const high = Math.max(open, close) + getRandomNumber(1, 3);
    const low = Math.min(open, close) - getRandomNumber(1, 3);
    
    contextCandles.push(createCandle(open, high, low, close));
    currentPrice = close; // Update current price for next candle
  }
  
  return contextCandles;
};

// Function to get patterns based on difficulty level
export const getPatternsByDifficulty = (maxDifficulty: number): CandlePattern[] => {
  return candlePatterns.filter(pattern => pattern.difficulty <= maxDifficulty);
};

// Function to get a random pattern with context candles
export const getRandomPattern = (maxDifficulty: number = 1): CandlePattern => {
  const availablePatterns = getPatternsByDifficulty(maxDifficulty);
  
  // Filter out engulfing patterns
  const engulfingIds = ['bullishEngulfing', 'bearishEngulfing'];
  const nonEngulfingPatterns = availablePatterns.filter(pattern => !engulfingIds.includes(pattern.id));
  const engulfingPatterns = availablePatterns.filter(pattern => engulfingIds.includes(pattern.id));
  
  // Ensure we have at least some patterns to choose from
  if (nonEngulfingPatterns.length === 0) {
    // If no non-engulfing patterns are available, use all available patterns
    const randomIndex = Math.floor(Math.random() * availablePatterns.length);
    const selectedPattern = availablePatterns[randomIndex];
    console.log(`Selected pattern (fallback): ${selectedPattern.name}`);
    return selectedPattern;
  }
  
  // Group patterns by difficulty for better distribution
  const easyPatterns = nonEngulfingPatterns.filter(p => p.difficulty === 1);
  const mediumPatterns = nonEngulfingPatterns.filter(p => p.difficulty === 2);
  const hardPatterns = nonEngulfingPatterns.filter(p => p.difficulty === 3);
  
  // Weighted selection based on difficulty and pattern type
  const random = Math.random();
  
  // Only 5% chance to select an engulfing pattern
  if (random < 0.05 && engulfingPatterns.length > 0) {
    const randomIndex = Math.floor(Math.random() * engulfingPatterns.length);
    const selectedPattern = engulfingPatterns[randomIndex];
    console.log(`Selected engulfing pattern: ${selectedPattern.name}`);
    return selectedPattern;
  }
  
  // Select based on difficulty (adjusted for available patterns)
  if (random < 0.4 && easyPatterns.length > 0) {
    // 35% chance for easy patterns
    const randomIndex = Math.floor(Math.random() * easyPatterns.length);
    const selectedPattern = easyPatterns[randomIndex];
    console.log(`Selected easy pattern: ${selectedPattern.name}`);
    return selectedPattern;
  } else if (random < 0.75 && mediumPatterns.length > 0) {
    // 35% chance for medium patterns
    const randomIndex = Math.floor(Math.random() * mediumPatterns.length);
    const selectedPattern = mediumPatterns[randomIndex];
    console.log(`Selected medium pattern: ${selectedPattern.name}`);
    return selectedPattern;
  } else if (hardPatterns.length > 0) {
    // 25% chance for hard patterns
    const randomIndex = Math.floor(Math.random() * hardPatterns.length);
    const selectedPattern = hardPatterns[randomIndex];
    console.log(`Selected hard pattern: ${selectedPattern.name}`);
    return selectedPattern;
  }
  
  // Fallback to any non-engulfing pattern if the selected difficulty group is empty
  const randomIndex = Math.floor(Math.random() * nonEngulfingPatterns.length);
  const selectedPattern = nonEngulfingPatterns[randomIndex];
  console.log(`Selected pattern (fallback): ${selectedPattern.name}`);
  return selectedPattern;
};

// Function to generate a complete chart with context and pattern candles
export const generateCompleteChart = (pattern: CandlePattern, contextCandleCount: number = 5): Candle[] => {
  // Generate the pattern candles
  const patternCandles = pattern.generatePattern();
  
  // Get the first candle's open price as a reference
  const basePrice = patternCandles[0].open;
  
  // Generate context candles before the pattern
  const contextCandles = generateContextCandles(basePrice, contextCandleCount);
  
  // Combine context and pattern candles
  return [...contextCandles, ...patternCandles];
}; 