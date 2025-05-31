"use client";

interface TimerCircleProps {
  minutes: number;
  seconds: number;
  progress: number;
  isRunning: boolean;
  isUIBreakActive: boolean;
  onStartTimer: () => void;
  onOpenCustomModal: () => void;
  disabled: boolean;
}

export default function TimerCircle({
  minutes,
  seconds,
  progress,
  isRunning,
  isUIBreakActive,
  onStartTimer,
  onOpenCustomModal,
  disabled,
}: TimerCircleProps) {
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center mb-8">
      {/* Timer Circle */}
      <div className="relative inline-block mb-6">
        {/* Progress Ring */}
        <svg
          className="absolute inset-0 w-80 h-80 transform -rotate-90"
          style={{ left: "-32px", top: "-32px" }}
        >
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="#e5e5e5"
            strokeWidth="8"
            fill="none"
            className="opacity-30 dark:stroke-gray-600"
          />
          {/* Progress circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="#F96943"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-out drop-shadow-sm"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(249, 105, 67, 0.3))",
            }}
          />
        </svg>

        {/* Timer Container */}
        <div
          className={`w-64 h-64 rounded-full bg-white dark:bg-gray-800 shadow-lg border-8 border-teal-100 dark:border-gray-600 relative overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-700/50 ${
            !isRunning && !isUIBreakActive
              ? "hover:scale-105 hover:cursor-pointer"
              : "cursor-default"
          }`}
          onClick={() => {
            if (!isRunning && !isUIBreakActive) {
              onStartTimer();
            }
          }}
          title={
            !isRunning && !isUIBreakActive
              ? "Timer'ı başlatmak için tıklayın"
              : ""
          }
        >
          {/* Click overlay hint */}
          {!isRunning && !isUIBreakActive && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Timer Media */}
          {isRunning ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/timer/timer-active.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/timer/timer-default.jpg"
              alt="Timer Default"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="text-7xl font-bold text-gray-700 dark:text-gray-200 tracking-wider">
          {formatTime(minutes, seconds)}
        </div>
        <button
          onClick={onOpenCustomModal}
          disabled={disabled}
          className={`ml-4 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 group relative ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
              : "bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:text-orange-600 dark:hover:text-orange-300 hover:scale-110 shadow-sm hover:shadow-md dark:shadow-gray-800/50"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {!disabled && (
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Özel timer ayarla (Ctrl+E)
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
