"use client";

import { SessionTypeResponseDto } from "../../hooks/useSessionTypes";
import { FocusSessionResponseDto } from "../../types/focusSession";
import { useState } from "react";

interface SessionTypeSelectorProps {
  sessionTypes: SessionTypeResponseDto[] | null;
  selectedSessionTypeId: number | null;
  isLoadingSessionTypes: boolean;
  sessionTypeError: { message: string; info?: string } | null;
  isRunning: boolean;
  activeFocusSession: FocusSessionResponseDto | null;
  onSessionTypeSelect: (sessionType: SessionTypeResponseDto) => void;
  onOpenSessionTypeManagement?: () => void;
  onEditSessionType?: (sessionType: SessionTypeResponseDto) => void;
}

export default function SessionTypeSelector({
  sessionTypes,
  selectedSessionTypeId,
  isLoadingSessionTypes,
  sessionTypeError,
  isRunning,
  activeFocusSession,
  onSessionTypeSelect,
  onOpenSessionTypeManagement,
  onEditSessionType,
}: SessionTypeSelectorProps) {
  const [showAllDesktop, setShowAllDesktop] = useState(false);

  // Function to truncate session type names
  const truncateName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  if (isLoadingSessionTypes) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-4 h-4"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-24 h-4"></div>
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2 w-24 h-8"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (sessionTypeError) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500">🕒</span>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Oturum Tipleri: Yükleme hatası
          </span>
        </div>
        <div className="text-xs text-red-500 dark:text-red-400">
          {sessionTypeError.message}
        </div>
      </div>
    );
  }

  // Desktop: limit to first 4 unless "show all" is clicked
  const displayedSessionTypes = sessionTypes
    ? showAllDesktop
      ? sessionTypes
      : sessionTypes.slice(0, 4)
    : [];

  const hasMoreItems = sessionTypes && sessionTypes.length > 4;

  return (
    <div className="mb-6">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🕒</span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Session Types:
        </span>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {selectedSessionTypeId ? "1 selected" : "None selected"}
        </div>
      </div>

      {/* Mobile: Horizontal Scrollable Row */}
      <div className="block md:hidden">
        <div className="flex items-center gap-2">
          <div
            className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0"
            style={{
              maxWidth: "300px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {sessionTypes?.map((sessionType) => {
              const isSelected = selectedSessionTypeId === sessionType.id;

              return (
                <div
                  key={sessionType.id}
                  className="flex-shrink-0 relative group"
                >
                  <button
                    onClick={() => onSessionTypeSelect(sessionType)}
                    disabled={isRunning || activeFocusSession !== null}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-md scale-105"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } ${
                      isRunning || activeFocusSession !== null
                        ? "opacity-50 cursor-not-allowed hover:scale-100"
                        : ""
                    }`}
                    title={`${sessionType.name} - ${Math.floor(
                      sessionType.workDuration / 60
                    )}dk çalışma • ${Math.floor(
                      sessionType.breakDuration / 60
                    )}dk mola${
                      sessionType.numberOfCycles
                        ? ` • ${sessionType.numberOfCycles} döngü`
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isSelected && (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {isSelected
                        ? sessionType.name
                        : truncateName(sessionType.name, 10)}{" "}
                      {/* Mobile: full name if selected */}
                      <span className="text-xs opacity-75">
                        ({Math.floor(sessionType.workDuration / 60)}/
                        {Math.floor(sessionType.breakDuration / 60)}
                        {sessionType.numberOfCycles
                          ? `/${sessionType.numberOfCycles}`
                          : ""}
                        )
                      </span>
                    </span>
                  </button>

                  {/* Edit button on hover */}
                  {onEditSessionType && !sessionType.isSystemDefined && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSessionType(sessionType);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 hover:scale-100 flex items-center justify-center shadow-lg z-10"
                      title="Edit Session Type"
                    >
                      <svg
                        className="w-3 h-3"
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
                    </button>
                  )}
                </div>
              );
            })}

            {(!sessionTypes || sessionTypes.length === 0) && (
              <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                No session types available
              </div>
            )}
          </div>

          {/* Mobile Add/Manage Button */}
          {onOpenSessionTypeManagement && (
            <button
              onClick={onOpenSessionTypeManagement}
              disabled={isRunning || activeFocusSession !== null}
              className={`flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed hover:scale-100"
                  : ""
              }`}
              title="Manage Session Types"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop: Grid Layout with Show More */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {displayedSessionTypes.map((sessionType) => {
            const isSelected = selectedSessionTypeId === sessionType.id;

            return (
              <div
                key={sessionType.id}
                className="flex-shrink-0 relative group"
              >
                <button
                  onClick={() => onSessionTypeSelect(sessionType)}
                  disabled={isRunning || activeFocusSession !== null}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${
                    isSelected
                      ? "bg-blue-500 text-white shadow-md scale-105"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  } ${
                    isRunning || activeFocusSession !== null
                      ? "opacity-50 cursor-not-allowed hover:scale-100"
                      : ""
                  }`}
                  title={`${sessionType.name} - ${Math.floor(
                    sessionType.workDuration / 60
                  )}dk çalışma • ${Math.floor(
                    sessionType.breakDuration / 60
                  )}dk mola${
                    sessionType.numberOfCycles
                      ? ` • ${sessionType.numberOfCycles} döngü`
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {isSelected
                      ? sessionType.name
                      : truncateName(sessionType.name, 15)}{" "}
                    {/* Desktop: full name if selected */}
                    <span className="text-xs opacity-75">
                      ({Math.floor(sessionType.workDuration / 60)}/
                      {Math.floor(sessionType.breakDuration / 60)}
                      {sessionType.numberOfCycles
                        ? `/${sessionType.numberOfCycles}`
                        : ""}
                      )
                    </span>
                  </span>
                </button>

                {/* Edit button on hover */}
                {onEditSessionType && !sessionType.isSystemDefined && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSessionType(sessionType);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 hover:scale-100 flex items-center justify-center shadow-lg z-10"
                    title="Edit Session Type"
                  >
                    <svg
                      className="w-3 h-3"
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
                  </button>
                )}
              </div>
            );
          })}

          {/* Show More Button */}
          {hasMoreItems && !showAllDesktop && (
            <button
              onClick={() => setShowAllDesktop(true)}
              disabled={isRunning || activeFocusSession !== null}
              className={`px-4 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              +{sessionTypes!.length - 4} Daha Fazla
            </button>
          )}

          {/* Show Less Button */}
          {showAllDesktop && hasMoreItems && (
            <button
              onClick={() => setShowAllDesktop(false)}
              disabled={isRunning || activeFocusSession !== null}
              className={`px-4 py-2 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Daha Az Göster
            </button>
          )}

          {/* Desktop Add/Manage Button - Inline */}
          {onOpenSessionTypeManagement && (
            <button
              onClick={onOpenSessionTypeManagement}
              disabled={isRunning || activeFocusSession !== null}
              className={`w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed hover:scale-100"
                  : ""
              }`}
              title="Manage Session Types"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          )}
        </div>

        {(!sessionTypes || sessionTypes.length === 0) && (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2 text-center">
            No session types available
          </div>
        )}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
