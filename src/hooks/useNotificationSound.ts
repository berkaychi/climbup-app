"use client";

export const useNotificationSound = () => {
  // Web Audio API ile basit beep sesleri
  const playFallbackBeep = (
    frequency: number = 800,
    duration: number = 200
  ) => {
    if (typeof window === "undefined") return;

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
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration / 1000
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn("Could not play fallback beep:", error);
    }
  };

  const playTimerCompleteSound = (
    type: "work" | "break" | "session" = "work"
  ) => {
    // Şimdilik sadece beep sesleri kullanıyoruz
    if (type === "work") {
      // Çalışma bitişi: çift beep (notification)
      playFallbackBeep(800, 200);
      setTimeout(() => playFallbackBeep(600, 200), 250);
    } else if (type === "break") {
      // Mola bitişi: azalan tonlarda üçlü beep
      playFallbackBeep(600, 150);
      setTimeout(() => playFallbackBeep(500, 150), 150);
      setTimeout(() => playFallbackBeep(400, 200), 300);
    } else {
      // Oturum tamamlandı: başarı melody'si (Do-Mi-Sol)
      playFallbackBeep(523, 150); // C5
      setTimeout(() => playFallbackBeep(659, 150), 150); // E5
      setTimeout(() => playFallbackBeep(784, 300), 300); // G5
    }
  };

  return {
    playTimerCompleteSound,
    playFallbackBeep,
  };
};
