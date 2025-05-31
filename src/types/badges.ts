// Badge Level Response DTO
export interface BadgeLevelResponseDto {
  badgeLevelID: number;
  level: number;
  name: string;
  description: string;
  iconURL: string;
  requiredValue: number;
}

// Badge Definition Response DTO - Updated with progress tracking
export interface BadgeDefinitionResponseDto {
  badgeDefinitionID: number;
  coreName: string;
  metricToTrack: string;
  description?: string;
  levels: BadgeLevelResponseDto[];

  // Progress tracking fields (for GET /api/users/{userId}/badges/progress endpoint)
  currentUserProgress: number; // User's current progress for this metric
  nextLevelRequiredValue?: number; // Required value for next level (null if max level achieved)
  currentAchievedLevel?: number; // User's current level for this badge (null if not earned)
  isMaxLevelAchieved: boolean; // Whether user has achieved the maximum level
}

// User Badge Response DTO
export interface UserBadgeResponseDto {
  userBadgeID: number;
  userId: string;
  dateAchieved: string; // ISO date string
  badgeDefinitionID: number;
  badgeCoreName: string;
  achievedLevel: BadgeLevelResponseDto;
}
