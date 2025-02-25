// Sound effect utility functions

// Create audio elements for each sound effect
let correctSound: HTMLAudioElement | null = null;
let wrongSound: HTMLAudioElement | null = null;
let clickSound: HTMLAudioElement | null = null;

// Flag to track if sounds are enabled
let soundEnabled = true;

// Flag to track if audio context is unlocked
let audioContextUnlocked = false;

// Initialize sound effects
export const initSoundEffects = () => {
  // Only initialize if we're in a browser environment
  if (typeof window !== 'undefined') {
    try {
      console.log('Initializing sound effects...');
      
      // Create and configure audio elements
      correctSound = new Audio();
      correctSound.src = process.env.PUBLIC_URL + '/sounds/correct.mp3'; // Use PUBLIC_URL
      correctSound.preload = 'auto';
      correctSound.volume = 0.7;
      
      wrongSound = new Audio();
      wrongSound.src = process.env.PUBLIC_URL + '/sounds/wrong.mp3'; // Use PUBLIC_URL
      wrongSound.preload = 'auto';
      wrongSound.volume = 0.7;
      
      clickSound = new Audio();
      clickSound.src = process.env.PUBLIC_URL + '/sounds/click.mp3'; // Use PUBLIC_URL
      clickSound.preload = 'auto';
      clickSound.volume = 0.5;
      
      // Add event listeners to detect when sounds are loaded
      correctSound.addEventListener('canplaythrough', () => console.log('Correct sound loaded'));
      wrongSound.addEventListener('canplaythrough', () => console.log('Wrong sound loaded'));
      clickSound.addEventListener('canplaythrough', () => console.log('Click sound loaded'));
      
      // Add error listeners
      correctSound.addEventListener('error', (e) => console.error('Error loading correct sound:', e));
      wrongSound.addEventListener('error', (e) => console.error('Error loading wrong sound:', e));
      clickSound.addEventListener('error', (e) => console.error('Error loading click sound:', e));
      
      // Force load the sounds
      correctSound.load();
      wrongSound.load();
      clickSound.load();
      
      // Try to load sound preference from localStorage
      const savedSoundPreference = localStorage.getItem('candleGameSoundEnabled');
      if (savedSoundPreference !== null) {
        soundEnabled = savedSoundPreference === 'true';
      }
      
      // Add a global click listener to unlock audio context
      document.addEventListener('click', unlockAudioContext, { once: true });
      document.addEventListener('touchstart', unlockAudioContext, { once: true });
      
      console.log('Sound system initialized, enabled:', soundEnabled);
    } catch (error) {
      console.error('Error initializing sound effects:', error);
    }
  }
};

// Function to unlock audio context on first user interaction
const unlockAudioContext = () => {
  if (audioContextUnlocked) return;
  
  console.log('Unlocking audio context on user interaction');
  
  // Create a silent audio context and play it
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const buffer = audioContext.createBuffer(1, 1, 22050);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
  
  // Also try to play each sound with volume 0
  if (correctSound) {
    const originalVolume = correctSound.volume;
    correctSound.volume = 0;
    correctSound.play().then(() => {
      correctSound!.volume = originalVolume;
      console.log('Correct sound unlocked');
    }).catch(e => console.error('Failed to unlock correct sound:', e));
  }
  
  if (wrongSound) {
    const originalVolume = wrongSound.volume;
    wrongSound.volume = 0;
    wrongSound.play().then(() => {
      wrongSound!.volume = originalVolume;
      console.log('Wrong sound unlocked');
    }).catch(e => console.error('Failed to unlock wrong sound:', e));
  }
  
  if (clickSound) {
    const originalVolume = clickSound.volume;
    clickSound.volume = 0;
    clickSound.play().then(() => {
      clickSound!.volume = originalVolume;
      console.log('Click sound unlocked');
    }).catch(e => console.error('Failed to unlock click sound:', e));
  }
  
  audioContextUnlocked = true;
  console.log('Audio context unlocked');
};

// Play correct answer sound
export const playCorrectSound = () => {
  if (!soundEnabled || !correctSound) return;
  
  try {
    console.log('Attempting to play correct sound');
    correctSound.currentTime = 0;
    const playPromise = correctSound.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Correct sound played successfully');
      }).catch(error => {
        console.error('Error playing correct sound:', error);
        // If we get a user interaction error, we need to unlock the audio context
        if (!audioContextUnlocked) {
          console.log('Audio not unlocked yet, adding event listeners');
          document.addEventListener('click', unlockAudioContext, { once: true });
          document.addEventListener('touchstart', unlockAudioContext, { once: true });
        }
      });
    }
  } catch (error) {
    console.error('Exception playing correct sound:', error);
  }
};

// Play wrong answer sound
export const playWrongSound = () => {
  if (!soundEnabled || !wrongSound) return;
  
  try {
    console.log('Attempting to play wrong sound');
    wrongSound.currentTime = 0;
    const playPromise = wrongSound.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Wrong sound played successfully');
      }).catch(error => {
        console.error('Error playing wrong sound:', error);
        // If we get a user interaction error, we need to unlock the audio context
        if (!audioContextUnlocked) {
          console.log('Audio not unlocked yet, adding event listeners');
          document.addEventListener('click', unlockAudioContext, { once: true });
          document.addEventListener('touchstart', unlockAudioContext, { once: true });
        }
      });
    }
  } catch (error) {
    console.error('Exception playing wrong sound:', error);
  }
};

// Play click sound
export const playClickSound = () => {
  if (!soundEnabled || !clickSound) return;
  
  try {
    console.log('Attempting to play click sound');
    clickSound.currentTime = 0;
    const playPromise = clickSound.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Click sound played successfully');
      }).catch(error => {
        console.error('Error playing click sound:', error);
        // If we get a user interaction error, we need to unlock the audio context
        if (!audioContextUnlocked) {
          console.log('Audio not unlocked yet, adding event listeners');
          document.addEventListener('click', unlockAudioContext, { once: true });
          document.addEventListener('touchstart', unlockAudioContext, { once: true });
        }
      });
    }
  } catch (error) {
    console.error('Exception playing click sound:', error);
  }
};

// Toggle sound on/off
export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  
  // If turning sound on, try to unlock audio context
  if (soundEnabled && !audioContextUnlocked) {
    unlockAudioContext();
  }
  
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