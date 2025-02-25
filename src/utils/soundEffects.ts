// Sound effect utility functions

// Create audio elements for each sound effect
let correctSound: HTMLAudioElement | null = null;
let wrongSound: HTMLAudioElement | null = null;
let clickSound: HTMLAudioElement | null = null;

// Flag to track if sounds are enabled
let soundEnabled = true;

// Initialize sound effects
export const initSoundEffects = () => {
  // Only initialize if we're in a browser environment
  if (typeof window !== 'undefined') {
    try {
      // Create and configure audio elements
      correctSound = new Audio();
      correctSound.src = '/sounds/correct.mp3'; // Local file path
      correctSound.preload = 'auto';
      correctSound.volume = 0.7;
      
      wrongSound = new Audio();
      wrongSound.src = '/sounds/wrong.mp3'; // Local file path
      wrongSound.preload = 'auto';
      wrongSound.volume = 0.7;
      
      clickSound = new Audio();
      clickSound.src = '/sounds/click.mp3'; // Local file path
      clickSound.preload = 'auto';
      clickSound.volume = 0.5;
      
      // Force preload all sounds
      Promise.all([
        preloadAudio(correctSound),
        preloadAudio(wrongSound),
        preloadAudio(clickSound)
      ]).then(() => {
        console.log('All sounds preloaded successfully');
      }).catch(err => {
        console.error('Error preloading sounds:', err);
      });
      
      // Try to load sound preference from localStorage
      const savedSoundPreference = localStorage.getItem('candleGameSoundEnabled');
      if (savedSoundPreference !== null) {
        soundEnabled = savedSoundPreference === 'true';
      }
      
      console.log('Sound system initialized, enabled:', soundEnabled);
    } catch (error) {
      console.error('Error initializing sound effects:', error);
    }
  }
};

// Helper function to preload audio
const preloadAudio = (audio: HTMLAudioElement): Promise<void> => {
  return new Promise((resolve, reject) => {
    audio.addEventListener('canplaythrough', () => resolve());
    audio.addEventListener('error', (e) => reject(e));
    audio.load();
  });
};

// Play correct answer sound
export const playCorrectSound = () => {
  if (soundEnabled && correctSound) {
    try {
      correctSound.currentTime = 0;
      const playPromise = correctSound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing correct sound:', error);
          // Auto-recover sound system on user interaction
          document.addEventListener('click', recoverAudio, { once: true });
        });
      }
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  }
};

// Play wrong answer sound
export const playWrongSound = () => {
  if (soundEnabled && wrongSound) {
    try {
      wrongSound.currentTime = 0;
      const playPromise = wrongSound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing wrong sound:', error);
          // Auto-recover sound system on user interaction
          document.addEventListener('click', recoverAudio, { once: true });
        });
      }
    } catch (error) {
      console.error('Error playing wrong sound:', error);
    }
  }
};

// Play click sound
export const playClickSound = () => {
  if (soundEnabled && clickSound) {
    try {
      clickSound.currentTime = 0;
      const playPromise = clickSound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing click sound:', error);
          // Auto-recover sound system on user interaction
          document.addEventListener('click', recoverAudio, { once: true });
        });
      }
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  }
};

// Function to recover audio context after user interaction
const recoverAudio = () => {
  console.log('Attempting to recover audio context...');
  // Try to play a silent sound to unlock audio
  const silentSound = new Audio();
  silentSound.play().then(() => {
    console.log('Audio context recovered');
  }).catch(error => {
    console.error('Failed to recover audio context:', error);
  });
};

// Toggle sound on/off
export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  
  // Save preference to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('candleGameSoundEnabled', soundEnabled.toString());
    console.log('Sound toggled:', soundEnabled ? 'ON' : 'OFF');
  }
  
  return soundEnabled;
};

// Get current sound state
export const isSoundEnabled = (): boolean => {
  return soundEnabled;
}; 