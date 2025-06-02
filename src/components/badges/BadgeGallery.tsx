"use client";

import { useState } from "react";
import {
  useBadgeDefinitions,
  useSpecificUserBadgeProgress,
  useUserBadges,
} from "../../hooks/useBadges";
import { BadgeService } from "../../lib/badgeService";
import {
  BadgeDefinitionResponseDto,
  UserBadgeResponseDto,
} from "../../types/badges";

interface BadgeGalleryProps {
  userId?: string;
}

const badgeService = new BadgeService();

export default function BadgeGallery({ userId }: BadgeGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { badgeDefinitions, isLoadingBadgeDefinitions, badgeDefinitionsError } =
    useBadgeDefinitions();

  const { badgeProgress, isLoadingBadgeProgress } =
    useSpecificUserBadgeProgress(userId || null);
  const { userBadges, isLoadingUserBadges } = useUserBadges();

  const isLoading =
    isLoadingBadgeDefinitions || isLoadingUserBadges || isLoadingBadgeProgress;

  // Group badges by category
  const categorizedBadges = badgeDefinitions
    ? badgeService.groupBadgesByCategory(badgeDefinitions)
    : {};
  const categories = Object.keys(categorizedBadges);

  // Filter badges based on selected category
  const filteredBadges =
    selectedCategory === "all"
      ? badgeDefinitions || []
      : categorizedBadges[selectedCategory] || [];

  const getBadgeProgressData = (badgeDefinitionId: number) => {
    return badgeProgress?.find(
      (p: BadgeDefinitionResponseDto) =>
        p.badgeDefinitionID === badgeDefinitionId
    );
  };

  const getUserEarnedBadge = (badgeDefinitionId: number) => {
    return userBadges?.find(
      (b: UserBadgeResponseDto) => b.badgeDefinitionID === badgeDefinitionId
    );
  };

  // Helper to check if a specific level is current
  const isCurrentLevel = (
    progressData: BadgeDefinitionResponseDto | undefined,
    levelNumber: number
  ) => {
    return progressData?.currentAchievedLevel === levelNumber;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (badgeDefinitionsError) {
    return (
      <div className="p-6 text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <p className="text-red-500 dark:text-red-400 text-lg mb-2">
          Rozet galerisi yüklenirken hata oluştu
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {badgeDefinitionsError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          🏆 Rozet Galerisi
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tüm rozetleri keşfedin ve ilerlemenizi takip edin
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Tümü ({badgeDefinitions?.length || 0})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {badgeService.getCategoryDisplayName(category)} (
              {categorizedBadges[category]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((definition: BadgeDefinitionResponseDto) => {
          const progressData = getBadgeProgressData(
            definition.badgeDefinitionID
          );
          const earnedBadge = getUserEarnedBadge(definition.badgeDefinitionID);
          const progressInfo = progressData
            ? badgeService.getProgressFromAPIData(progressData)
            : null;

          return (
            <div
              key={definition.badgeDefinitionID}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                earnedBadge
                  ? "border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="p-6">
                {/* Badge Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {badgeService.getBadgeIcon(definition.metricToTrack)}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">
                        {definition.coreName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {badgeService.getCategoryDisplayName(
                          definition.metricToTrack
                        )}
                      </p>
                    </div>
                  </div>
                  {earnedBadge && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Kazanıldı
                    </div>
                  )}
                </div>

                {/* Description */}
                {definition.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {definition.description}
                  </p>
                )}

                {/* Progress Bar (if not completed) */}
                {progressInfo && !progressInfo.isMaxLevel && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        İlerleme
                      </span>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        %{Math.round(progressInfo.progress)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                        style={{ width: `${progressInfo.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {progressInfo.currentValue} /{" "}
                        {progressInfo.targetValue || "?"}
                      </span>
                      {progressInfo.nextLevel && (
                        <span className="text-xs text-orange-600 dark:text-orange-400">
                          Sonraki: {progressInfo.nextLevel.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Badge Levels */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Seviyeler
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {definition.levels.map((level) => {
                      const isEarned =
                        earnedBadge &&
                        earnedBadge.achievedLevel.level >= level.level;
                      const isCurrent = isCurrentLevel(
                        progressData,
                        level.level
                      );

                      return (
                        <div
                          key={level.badgeLevelID}
                          className={`flex items-center p-2 rounded-lg border text-xs ${
                            isEarned
                              ? "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                              : isCurrent
                              ? "border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20"
                              : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                          }`}
                        >
                          <img
                            src={level.iconURL}
                            alt={level.name}
                            className={`w-6 h-6 object-contain mr-2 ${
                              !isEarned ? "opacity-50 grayscale" : ""
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {level.name}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {level.requiredValue}{" "}
                              {definition.metricToTrack.includes("hours")
                                ? "saat"
                                : ""}
                            </div>
                          </div>
                          {isEarned && (
                            <div className="text-green-600 dark:text-green-400">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Bu kategoride henüz rozet bulunmuyor
          </p>
        </div>
      )}
    </div>
  );
}
