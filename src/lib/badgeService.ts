import {
  BadgeDefinitionResponseDto,
  BadgeLevelResponseDto,
  UserBadgeResponseDto,
} from "../types/badges";

export class BadgeService {
  // Get badge icon with climbing themes
  getBadgeIcon(metricToTrack: string): string {
    const iconMap: Record<string, string> = {
      completed_focus_sessions: "🎯",
      total_focus_duration_hours: "⏱️",
      consecutive_days: "🔥",
      weekly_goals: "📊",
      perfect_weeks: "💎",
      study_streak: "⛰️",
      deep_focus: "🧗‍♂️",
      productivity_score: "🏆",
      task_completion: "✅",
      time_mastery: "⚡",
    };
    return iconMap[metricToTrack] || "🏅";
  }

  // NEW: Get progress info directly from API progress data
  getProgressFromAPIData(definition: BadgeDefinitionResponseDto): {
    currentLevel: BadgeLevelResponseDto | null;
    nextLevel: BadgeLevelResponseDto | null;
    progress: number;
    isMaxLevel: boolean;
    currentValue: number;
    targetValue: number | null;
  } {
    const currentLevel = definition.currentAchievedLevel
      ? definition.levels.find(
          (l) => l.level === definition.currentAchievedLevel
        ) || null
      : null;

    const nextLevel = definition.nextLevelRequiredValue
      ? definition.levels.find(
          (l) => l.requiredValue === definition.nextLevelRequiredValue
        ) || null
      : null;

    const currentValue = definition.currentUserProgress;
    const targetValue = definition.nextLevelRequiredValue ?? null;
    const isMaxLevel = definition.isMaxLevelAchieved;

    let progress = 0;
    if (!isMaxLevel && targetValue) {
      const baseValue = currentLevel ? currentLevel.requiredValue : 0;
      const progressValue = currentValue - baseValue;
      const totalRequired = targetValue - baseValue;
      progress = Math.min(
        100,
        Math.max(0, (progressValue / totalRequired) * 100)
      );
    } else if (isMaxLevel) {
      progress = 100;
    }

    return {
      currentLevel,
      nextLevel,
      progress,
      isMaxLevel,
      currentValue,
      targetValue,
    };
  }

  // NEW: Get next achievable badges (not yet earned)
  getNextAchievableBadges(
    progressData: BadgeDefinitionResponseDto[],
    limit: number = 3
  ): BadgeDefinitionResponseDto[] {
    return progressData
      .filter((definition) => !definition.isMaxLevelAchieved)
      .filter((definition) => definition.nextLevelRequiredValue !== undefined)
      .sort((a, b) => {
        const progressA = this.getProgressFromAPIData(a).progress;
        const progressB = this.getProgressFromAPIData(b).progress;
        return progressB - progressA; // Sort by highest progress first
      })
      .slice(0, limit);
  }

  // NEW: Get badges close to completion (progress > 75%)
  getCloseToCompletionBadges(
    progressData: BadgeDefinitionResponseDto[]
  ): BadgeDefinitionResponseDto[] {
    return progressData
      .filter((definition) => {
        const progressInfo = this.getProgressFromAPIData(definition);
        return !progressInfo.isMaxLevel && progressInfo.progress > 75;
      })
      .sort((a, b) => {
        const progressA = this.getProgressFromAPIData(a).progress;
        const progressB = this.getProgressFromAPIData(b).progress;
        return progressB - progressA;
      });
  }

  // Get next level for a badge definition
  getNextLevel(
    definition: BadgeDefinitionResponseDto,
    currentValue: number
  ): BadgeLevelResponseDto | null {
    const sortedLevels = [...definition.levels].sort(
      (a, b) => a.requiredValue - b.requiredValue
    );

    return (
      sortedLevels.find((level) => level.requiredValue > currentValue) || null
    );
  }

  // Get current achieved level
  getCurrentLevel(
    definition: BadgeDefinitionResponseDto,
    currentValue: number
  ): BadgeLevelResponseDto | null {
    const sortedLevels = [...definition.levels].sort(
      (a, b) => b.requiredValue - a.requiredValue
    );

    return (
      sortedLevels.find((level) => level.requiredValue <= currentValue) || null
    );
  }

  // Calculate progress to next level (legacy method, use getProgressFromAPIData for real data)
  getProgressToNextLevel(
    definition: BadgeDefinitionResponseDto,
    currentValue: number
  ): {
    currentLevel: BadgeLevelResponseDto | null;
    nextLevel: BadgeLevelResponseDto | null;
    progress: number;
    isMaxLevel: boolean;
  } {
    const currentLevel = this.getCurrentLevel(definition, currentValue);
    const nextLevel = this.getNextLevel(definition, currentValue);

    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: null,
        progress: 100,
        isMaxLevel: true,
      };
    }

    const baseValue = currentLevel ? currentLevel.requiredValue : 0;
    const targetValue = nextLevel.requiredValue;
    const progressValue = currentValue - baseValue;
    const totalRequired = targetValue - baseValue;

    const progress = Math.min(100, (progressValue / totalRequired) * 100);

    return {
      currentLevel,
      nextLevel,
      progress: Math.max(0, progress),
      isMaxLevel: false,
    };
  }

  // Check if user has earned a specific badge
  hasUserEarnedBadge(
    userBadges: UserBadgeResponseDto[],
    badgeDefinitionId: number
  ): UserBadgeResponseDto | null {
    return (
      userBadges.find(
        (badge) => badge.badgeDefinitionID === badgeDefinitionId
      ) || null
    );
  }

  // Get recently earned badges (last 7 days)
  getRecentlyEarnedBadges(
    userBadges: UserBadgeResponseDto[]
  ): UserBadgeResponseDto[] {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return userBadges.filter(
      (badge) => new Date(badge.dateAchieved) >= sevenDaysAgo
    );
  }

  // Group badges by category (metricToTrack)
  groupBadgesByCategory(
    definitions: BadgeDefinitionResponseDto[]
  ): Record<string, BadgeDefinitionResponseDto[]> {
    return definitions.reduce((groups, definition) => {
      const category = definition.metricToTrack;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(definition);
      return groups;
    }, {} as Record<string, BadgeDefinitionResponseDto[]>);
  }

  // Get badge rarity based on level
  getBadgeRarity(level: BadgeLevelResponseDto): {
    rarity: string;
    color: string;
    description: string;
  } {
    if (level.level === 1) {
      return {
        rarity: "Başlangıç",
        color: "#CD7F32", // Bronze
        description: "İlk adımlar",
      };
    } else if (level.level <= 3) {
      return {
        rarity: "Yaygın",
        color: "#C0C0C0", // Silver
        description: "Düzenli tırmanıcı",
      };
    } else if (level.level <= 5) {
      return {
        rarity: "Nadir",
        color: "#FFD700", // Gold
        description: "Deneyimli dağcı",
      };
    } else if (level.level <= 8) {
      return {
        rarity: "Efsanevi",
        color: "#E6E6FA", // Lavender (Epic)
        description: "Zirve ustası",
      };
    } else {
      return {
        rarity: "Mitik",
        color: "#FF6347", // Tomato (Mythic)
        description: "Efsanevi tırmanıcı",
      };
    }
  }

  // Format duration for time-based badges
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }
    return `${minutes}dk`;
  }

  // Get encouragement message based on progress
  getEncouragementMessage(progress: number): string {
    if (progress < 25) {
      return "🎯 Başlangıç yolculuğun harika!";
    } else if (progress < 50) {
      return "⛰️ Patikayı takip ediyorsun!";
    } else if (progress < 75) {
      return "🧗‍♂️ Zirveye yaklaşıyorsun!";
    } else if (progress < 95) {
      return "🏔️ Çok az kaldı, devam et!";
    } else {
      return "🏆 Zirveye çok yakınsın!";
    }
  }

  // Get climbing-themed category names
  getCategoryDisplayName(metricToTrack: string): string {
    const categoryNames: Record<string, string> = {
      completed_focus_sessions: "Zirve Akıncısı",
      total_focus_duration_hours: "İrtifa Koleksiyoncusu",
      consecutive_days: "Devamlılık Ustası",
      weekly_goals: "Haftalık Kahraman",
      perfect_weeks: "Mükemmellik Avcısı",
      study_streak: "Çalışma Seri",
      deep_focus: "Derin Odak",
      productivity_score: "Verimlilik Şampiyonu",
      task_completion: "Görev Tamamlayıcı",
      time_mastery: "Zaman Ustası",
    };
    return categoryNames[metricToTrack] || "Genel Başarı";
  }

  // Sort badges by achievement date (newest first)
  sortBadgesByDate(badges: UserBadgeResponseDto[]): UserBadgeResponseDto[] {
    return [...badges].sort(
      (a, b) =>
        new Date(b.dateAchieved).getTime() - new Date(a.dateAchieved).getTime()
    );
  }

  // Get badge preview text for sharing
  getBadgeShareText(badge: UserBadgeResponseDto): string {
    return `🏆 Yeni rozet kazandım: ${badge.badgeCoreName} - ${badge.achievedLevel.name}! ClimbUp ile hedeflerime tırmanıyorum! 🧗‍♂️`;
  }
}
