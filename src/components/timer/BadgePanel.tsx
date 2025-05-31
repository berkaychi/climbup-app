"use client";

import { useBadges } from "../../hooks/useBadges";
import { BadgeService } from "../../lib/badgeService";

interface BadgePanelProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export default function BadgePanel({
  isExpanded,
  onToggleExpanded,
}: BadgePanelProps) {
  const {
    userBadges,
    badgeProgress,
    isLoadingUserBadges,
    isLoadingBadgeProgress,
    userBadgesError,
    badgeProgressError,
  } = useBadges();

  const badgeService = new BadgeService();

  const isLoading = isLoadingUserBadges || isLoadingBadgeProgress;
  const hasError = userBadgesError || badgeProgressError;

  return (
    <>
      {/* Collapsed State - Horizontal Bar */}
      {!isExpanded && (
        <div className="hidden xl:block fixed right-4 top-24 z-30">
          <button
            onClick={onToggleExpanded}
            className="flex items-center gap-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 px-4 py-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group"
            title="Rozet panelini genişlet"
          >
            {/* Badge Icon */}
            <div className="text-xl">🥇</div>

            {/* BADGES Text */}
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100 tracking-wider">
              BADGES
            </span>

            {/* Expand Arrow */}
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Expanded State - Side Panel */}
      {isExpanded && (
        <div className="hidden xl:block fixed right-4 top-1/2 transform -translate-y-1/2 h-[80vh] w-80 z-30">
          {/* Toggle Button */}
          <button
            onClick={onToggleExpanded}
            className="absolute left-4 top-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 dark:border-gray-700/30 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            title="Rozet panelini kapat"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Panel Content */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 h-full p-4">
            <div className="flex items-center justify-between mb-4 mt-12">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                🏆 Rozetlerim
              </h2>
              {userBadges && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {userBadges.length} rozet
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-16"></div>
                  </div>
                ))}
              </div>
            ) : userBadges && userBadges.length > 0 ? (
              <div className="space-y-3 h-[calc(100%-80px)] overflow-y-auto">
                {badgeService.sortBadgesByDate(userBadges).map((badge) => {
                  const rarity = badgeService.getBadgeRarity(
                    badge.achievedLevel
                  );
                  const isRecent =
                    badgeService.getRecentlyEarnedBadges([badge]).length > 0;

                  return (
                    <div
                      key={badge.userBadgeID}
                      className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                        isRecent
                          ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20 ring-2 ring-yellow-200 dark:ring-yellow-600"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative mr-3 flex-shrink-0">
                          <img
                            src={badge.achievedLevel.iconURL}
                            alt={badge.achievedLevel.name}
                            className="w-12 h-12 object-contain shadow-md"
                            style={{
                              filter: `drop-shadow(0 2px 4px ${rarity.color}40)`,
                            }}
                          />
                          {isRecent && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✨</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                              {badge.badgeCoreName}
                            </h4>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${rarity.color}20`,
                                color: rarity.color,
                              }}
                            >
                              {rarity.rarity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {badge.achievedLevel.name}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Seviye {badge.achievedLevel.level}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(badge.dateAchieved).toLocaleDateString(
                                "tr-TR",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Real-time Progress indicators for next badges */}
                {badgeProgress && userBadges && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                      🎯 Sonraki Hedefler
                    </h3>
                    {badgeService
                      .getNextAchievableBadges(badgeProgress, 3)
                      .map((definition) => {
                        const progressInfo =
                          badgeService.getProgressFromAPIData(definition);

                        if (!progressInfo.nextLevel) return null;

                        return (
                          <div
                            key={definition.badgeDefinitionID}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3"
                          >
                            <div className="flex items-center mb-2">
                              <img
                                src={progressInfo.nextLevel.iconURL}
                                alt={progressInfo.nextLevel.name}
                                className="w-8 h-8 object-contain mr-2 opacity-75"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                                  {definition.coreName}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {progressInfo.nextLevel.name}
                                </p>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                                style={{ width: `${progressInfo.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {progressInfo.currentValue} /{" "}
                                {progressInfo.targetValue}
                              </span>
                              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                %{Math.round(progressInfo.progress)}
                              </span>
                            </div>
                            <div className="mt-1">
                              <span className="text-xs text-orange-500 dark:text-orange-400">
                                {badgeService.getEncouragementMessage(
                                  progressInfo.progress
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                    {/* Show badges close to completion */}
                    {badgeService.getCloseToCompletionBadges(badgeProgress)
                      .length > 0 && (
                      <div className="mt-4 pt-3 border-t border-orange-200 dark:border-orange-800">
                        <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">
                          🔥 Tamamlanmaya Yakın
                        </h4>
                        {badgeService
                          .getCloseToCompletionBadges(badgeProgress)
                          .slice(0, 2)
                          .map((definition) => {
                            const progressInfo =
                              badgeService.getProgressFromAPIData(definition);
                            if (!progressInfo.nextLevel) return null;

                            return (
                              <div
                                key={definition.badgeDefinitionID}
                                className="text-xs text-orange-600 dark:text-orange-400 mb-1"
                              >
                                ⚡ {definition.coreName} - %
                                {Math.round(progressInfo.progress)}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : hasError ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">⚠️</div>
                <p className="text-red-500 dark:text-red-400 text-sm mb-1">
                  Rozetler yüklenirken hata oluştu
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  {(userBadgesError || badgeProgressError)?.message}
                </p>
              </div>
            ) : (
              // Show Level 1 badges for new users
              <div className="space-y-3 h-[calc(100%-80px)] overflow-y-auto">
                <div className="text-center py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="text-2xl mb-2">🌟</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Başlangıç Rozetleri
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">
                    İlk hedeflerinizi keşfedin!
                  </p>
                </div>

                {badgeProgress && badgeProgress.length > 0 ? (
                  badgeProgress
                    .filter((definition) => definition.levels.length > 0)
                    .slice(0, 5) // Show first 5 badge categories
                    .map((definition) => {
                      const level1Badge = definition.levels[0]; // Get Level 1 badge
                      const progressInfo =
                        badgeService.getProgressFromAPIData(definition);

                      return (
                        <div
                          key={definition.badgeDefinitionID}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                        >
                          <div className="flex items-center">
                            <div className="relative mr-3 flex-shrink-0">
                              <img
                                src={level1Badge.iconURL}
                                alt={level1Badge.name}
                                className="w-12 h-12 object-contain shadow-md opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                                style={{
                                  filter: `drop-shadow(0 2px 4px ${
                                    badgeService.getBadgeRarity(level1Badge)
                                      .color
                                  }40)`,
                                }}
                              />
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">🎯</span>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                                  {definition.coreName}
                                </h4>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                  Hedef
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {level1Badge.name}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {level1Badge.requiredValue}{" "}
                                  {definition.metricToTrack.includes("hours")
                                    ? "saat"
                                    : definition.metricToTrack.includes(
                                        "sessions"
                                      )
                                    ? "seans"
                                    : "gün"}{" "}
                                  gerekli
                                </span>
                                {progressInfo && (
                                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                    {progressInfo.currentValue || 0} /{" "}
                                    {level1Badge.requiredValue}
                                  </span>
                                )}
                              </div>
                              {progressInfo &&
                                progressInfo.currentValue > 0 && (
                                  <div className="mt-2">
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                      <div
                                        className="h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                                        style={{
                                          width: `${Math.min(
                                            (progressInfo.currentValue /
                                              level1Badge.requiredValue) *
                                              100,
                                            100
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-3">🏆</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                      Henüz rozet kazanmadınız
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">
                      Odaklanma seansları tamamlayarak ilk rozetinizi kazanın!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
