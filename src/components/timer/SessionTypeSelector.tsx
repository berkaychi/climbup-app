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
      <div className="mb-6" data-oid="r6vu2eh">
        <div className="flex items-center gap-2 mb-2" data-oid="_mf1hkr">
          <div
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-4 h-4"
            data-oid=".700dhc"
          ></div>
          <div
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-24 h-4"
            data-oid="8in6pyr"
          ></div>
        </div>
        <div className="flex gap-2 overflow-hidden" data-oid=":c9zr65">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2 w-24 h-8"
              data-oid="k9ja7hz"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (sessionTypeError) {
    return (
      <div className="mb-6" data-oid=".cygh06">
        <div className="flex items-center gap-2 mb-2" data-oid="pzt55df">
          <span className="text-red-500" data-oid="j:zsoom">
            🕒
          </span>
          <span
            className="text-sm font-medium text-red-600 dark:text-red-400"
            data-oid="4vq:a.q"
          >
            Oturum Tipleri: Yükleme hatası
          </span>
        </div>
        <div
          className="text-xs text-red-500 dark:text-red-400"
          data-oid="yoxx:wb"
        >
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
    <div className="mb-6" data-oid="_i1p:ri">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3" data-oid="v:yyr.z">
        <span className="text-lg" data-oid="bnk9:ev">
          🕒
        </span>
        <span
          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          data-oid="97r5wvm"
        >
          Session Types:
        </span>
        <div
          className="text-xs text-gray-500 dark:text-gray-400"
          data-oid="f_gu93_"
        >
          {selectedSessionTypeId ? "1 selected" : "None selected"}
        </div>
      </div>

      {/* Mobile: Horizontal Scrollable Row */}
      <div className="block md:hidden" data-oid="vxqrpw3">
        <div className="flex items-center gap-2" data-oid="mzmp-6j">
          <div
            className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0"
            style={{
              maxWidth: "300px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            data-oid="gnlsydo"
          >
            {sessionTypes?.map((sessionType) => {
              const isSelected = selectedSessionTypeId === sessionType.id;

              return (
                <div
                  key={sessionType.id}
                  className="flex-shrink-0 relative group"
                  data-oid="nfkkx75"
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
                      sessionType.workDuration / 60,
                    )}dk çalışma • ${Math.floor(
                      sessionType.breakDuration / 60,
                    )}dk mola${
                      sessionType.numberOfCycles
                        ? ` • ${sessionType.numberOfCycles} döngü`
                        : ""
                    }`}
                    data-oid="t6lsa_7"
                  >
                    <span
                      className="flex items-center gap-2"
                      data-oid=":70ao.5"
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          data-oid="g5do6x3"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                            data-oid="i8ulb6g"
                          />
                        </svg>
                      )}
                      {isSelected
                        ? sessionType.name
                        : truncateName(sessionType.name, 10)}{" "}
                      {/* Mobile: full name if selected */}
                      <span className="text-xs opacity-75" data-oid="y3v8eik">
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
                      data-oid="tuyb73h"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="ra6bz8a"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          data-oid="o5lsy2f"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}

            {(!sessionTypes || sessionTypes.length === 0) && (
              <div
                className="text-sm text-gray-500 dark:text-gray-400 py-2"
                data-oid="v112qfi"
              >
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
              data-oid="q44n28o"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="ujg3d7v"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  data-oid="ch47x-:"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop: Grid Layout with Show More */}
      <div className="hidden md:block" data-oid="ea17tpm">
        <div
          className="flex items-center justify-center gap-2 flex-wrap"
          data-oid=".0l095:"
        >
          {displayedSessionTypes.map((sessionType) => {
            const isSelected = selectedSessionTypeId === sessionType.id;

            return (
              <div
                key={sessionType.id}
                className="flex-shrink-0 relative group"
                data-oid="aezg65:"
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
                    sessionType.workDuration / 60,
                  )}dk çalışma • ${Math.floor(
                    sessionType.breakDuration / 60,
                  )}dk mola${
                    sessionType.numberOfCycles
                      ? ` • ${sessionType.numberOfCycles} döngü`
                      : ""
                  }`}
                  data-oid="xdrxb:v"
                >
                  <span className="flex items-center gap-2" data-oid="ozale5l">
                    {isSelected && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        data-oid="6nbngr8"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                          data-oid="1i2.ns8"
                        />
                      </svg>
                    )}
                    {isSelected
                      ? sessionType.name
                      : truncateName(sessionType.name, 15)}{" "}
                    {/* Desktop: full name if selected */}
                    <span className="text-xs opacity-75" data-oid="lod48cu">
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
                    data-oid=".-loc2g"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="_-dlc_k"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        data-oid="h5-zrhz"
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
              data-oid="4dl2g8."
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
              data-oid=".ofkvvs"
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
              data-oid="yf9a603"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="yu6csge"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  data-oid="boibe75"
                />
              </svg>
            </button>
          )}
        </div>

        {(!sessionTypes || sessionTypes.length === 0) && (
          <div
            className="text-sm text-gray-500 dark:text-gray-400 py-2 text-center"
            data-oid="86ftzrr"
          >
            No session types available
          </div>
        )}
      </div>

      <style jsx data-oid=".hdj7t.">{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
