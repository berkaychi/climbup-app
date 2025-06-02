"use client";

import { TagDto } from "../../hooks/useTags";
import { FocusSessionResponseDto } from "../../types/focusSession";
import { useState } from "react";

interface TagSelectorProps {
  apiTags: TagDto[] | null;
  selectedTags: string[];
  isLoadingTags: boolean;
  tagError: { message: string; info?: string } | null;
  isRunning: boolean;
  activeFocusSession: FocusSessionResponseDto | null;
  onToggleTag: (tagName: string) => void;
  onOpenTagManagement?: () => void;
  onEditTag?: (tag: TagDto) => void;
}

// Automatic text color algorithm based on background color contrast
const getTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance using WCAG formula
  const getLuminance = (rgb: number) => {
    const sRGB = rgb / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const luminance =
    0.2126 * getLuminance(r) +
    0.7152 * getLuminance(g) +
    0.0722 * getLuminance(b);

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export default function TagSelector({
  apiTags,
  selectedTags,
  isLoadingTags,
  tagError,
  isRunning,
  activeFocusSession,
  onToggleTag,
  onOpenTagManagement,
  onEditTag,
}: TagSelectorProps) {
  const [showAllDesktop, setShowAllDesktop] = useState(false);

  if (isLoadingTags) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-4 h-4"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-16 h-4"></div>
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1.5 w-16 h-7"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (tagError) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-500">🏷️</span>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Etiketler: Yükleme hatası
          </span>
        </div>
        <div className="text-xs text-red-500 dark:text-red-400">
          {tagError.message}
        </div>
      </div>
    );
  }

  // Desktop: limit to first 4 unless "show all" is clicked
  const displayedTags = apiTags
    ? showAllDesktop
      ? apiTags
      : apiTags.slice(0, 4)
    : [];

  const hasMoreItems = apiTags && apiTags.length > 4;

  return (
    <div className="mb-4">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏷️</span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tags:
        </span>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {selectedTags.length > 0
            ? `${selectedTags.length} selected`
            : "None selected"}
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
            {apiTags?.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);

              return (
                <div key={tag.id} className="flex-shrink-0 relative group">
                  <button
                    onClick={() => onToggleTag(tag.name)}
                    disabled={isRunning || activeFocusSession !== null}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${
                      isRunning || activeFocusSession !== null
                        ? "opacity-50 cursor-not-allowed hover:scale-100"
                        : ""
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: tag.color || "#718096",
                            color: getTextColor(tag.color || "#718096"),
                            transform: "scale(1.05)",
                            boxShadow: `0 2px 4px ${tag.color || "#718096"}30`,
                          }
                        : {
                            backgroundColor: "transparent",
                            color: "inherit",
                            border: `1px solid ${tag.color || "#718096"}`,
                          }
                    }
                    title={tag.description || tag.name}
                  >
                    <span className="flex items-center gap-1.5">
                      {/* Color indicator for unselected tags */}
                      {!isSelected && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color || "#718096" }}
                        />
                      )}

                      {/* Checkmark for selected tags */}
                      {isSelected && (
                        <svg
                          className="w-3 h-3"
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
                      {tag.name}
                    </span>
                  </button>

                  {/* Edit button on hover */}
                  {onEditTag && !tag.isSystemDefined && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTag(tag);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 hover:scale-100 flex items-center justify-center shadow-lg z-10"
                      title="Edit Tag"
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

            {(!apiTags || apiTags.length === 0) && (
              <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                No tags available
              </div>
            )}
          </div>

          {/* Mobile Add/Manage Button */}
          {onOpenTagManagement && (
            <button
              onClick={onOpenTagManagement}
              disabled={isRunning || activeFocusSession !== null}
              className={`flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed hover:scale-100"
                  : ""
              }`}
              title="Manage Tags"
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
          {displayedTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.name);

            return (
              <div key={tag.id} className="flex-shrink-0 relative group">
                <button
                  onClick={() => onToggleTag(tag.name)}
                  disabled={isRunning || activeFocusSession !== null}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${
                    isRunning || activeFocusSession !== null
                      ? "opacity-50 cursor-not-allowed hover:scale-100"
                      : ""
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: tag.color || "#718096",
                          color: getTextColor(tag.color || "#718096"),
                          transform: "scale(1.05)",
                          boxShadow: `0 2px 4px ${tag.color || "#718096"}30`,
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "inherit",
                          border: `1px solid ${tag.color || "#718096"}`,
                        }
                  }
                  title={tag.description || tag.name}
                >
                  <span className="flex items-center gap-1.5">
                    {/* Color indicator for unselected tags */}
                    {!isSelected && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color || "#718096" }}
                      />
                    )}

                    {/* Checkmark for selected tags */}
                    {isSelected && (
                      <svg
                        className="w-3 h-3"
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
                    {tag.name}
                  </span>
                </button>

                {/* Edit button on hover */}
                {onEditTag && !tag.isSystemDefined && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTag(tag);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 hover:scale-100 flex items-center justify-center shadow-lg z-10"
                    title="Edit Tag"
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
              className={`px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              +{apiTags!.length - 4} Daha Fazla
            </button>
          )}

          {/* Show Less Button */}
          {showAllDesktop && hasMoreItems && (
            <button
              onClick={() => setShowAllDesktop(false)}
              disabled={isRunning || activeFocusSession !== null}
              className={`px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Daha Az Göster
            </button>
          )}

          {/* Desktop Add/Manage Button - Inline */}
          {onOpenTagManagement && (
            <button
              onClick={onOpenTagManagement}
              disabled={isRunning || activeFocusSession !== null}
              className={`w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
                isRunning || activeFocusSession !== null
                  ? "opacity-50 cursor-not-allowed hover:scale-100"
                  : ""
              }`}
              title="Manage Tags"
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

        {(!apiTags || apiTags.length === 0) && (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2 text-center">
            No tags available
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
