"use client";

export default function KeyboardShortcutsInfo() {
  return (
    <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg dark:shadow-gray-900/50">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
        Klavye Kısayolları
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-700/80 rounded-lg p-2">
          <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
            Space
          </kbd>
          <span className="text-gray-600 dark:text-gray-400">Timer Başlat</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-700/80 rounded-lg p-2">
          <div className="flex gap-1">
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              Ctrl
            </kbd>
            <span className="text-gray-500 dark:text-gray-400">+</span>
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              R
            </kbd>
          </div>
          <span className="text-gray-600 dark:text-gray-400">Sıfırla</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-700/80 rounded-lg p-2">
          <div className="flex gap-1">
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              Ctrl
            </kbd>
            <span className="text-gray-500 dark:text-gray-400">+</span>
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              E
            </kbd>
          </div>
          <span className="text-gray-600 dark:text-gray-400">Özel Timer</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-700/80 rounded-lg p-2">
          <div className="flex gap-1">
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              Ctrl
            </kbd>
            <span className="text-gray-500 dark:text-gray-400">+</span>
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              T
            </kbd>
          </div>
          <span className="text-gray-600 dark:text-gray-400">Görev Paneli</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-700/80 rounded-lg p-2">
          <div className="flex gap-1">
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              Ctrl
            </kbd>
            <span className="text-gray-500 dark:text-gray-400">+</span>
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              B
            </kbd>
          </div>
          <span className="text-gray-600 dark:text-gray-400">Rozet Paneli</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-700/80 rounded-lg p-2">
          <div className="flex gap-1">
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              Ctrl
            </kbd>
            <span className="text-gray-500 dark:text-gray-400">+</span>
            <kbd className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-mono">
              M
            </kbd>
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            Mobil Görevler
          </span>
        </div>
      </div>
    </div>
  );
}
