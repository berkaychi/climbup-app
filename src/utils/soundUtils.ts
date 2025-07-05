// Timer completion sound utilities

// Play a simple beep sound using Web Audio API
export const playBeepSound = (
  frequency: number = 800,
  duration: number = 200
) => {
  if (typeof window === "undefined" || !window.AudioContext) {
    console.warn("Web Audio API not supported");
    return;
  }

  try {
    // TypeScript için interface tanımı
    interface ExtendedWindow extends Window {
      webkitAudioContext?: typeof AudioContext;
    }

    const windowExt = window as ExtendedWindow;
    const audioContext = new (window.AudioContext ||
      windowExt.webkitAudioContext ||
      AudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.warn("Could not play beep sound:", error);
  }
};

// Play a success sound (multiple beeps)
export const playSuccessSound = () => {
  playBeepSound(523, 150); // C5
  setTimeout(() => playBeepSound(659, 150), 150); // E5
  setTimeout(() => playBeepSound(784, 300), 300); // G5
};

// Play a notification sound (double beep)
export const playNotificationSound = () => {
  playBeepSound(800, 200);
  setTimeout(() => playBeepSound(600, 200), 250);
};

// Play break time sound (descending beeps)
export const playBreakSound = () => {
  playBeepSound(600, 150);
  setTimeout(() => playBeepSound(500, 150), 150);
  setTimeout(() => playBeepSound(400, 200), 300);
};
