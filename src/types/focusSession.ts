// climbup-app/src/types/focusSession.ts

/**
 * Data Transfer Object for Tag information.
 * Based on the definition in `climbup-app/src/hooks/useTags.ts`.
 */
export interface TagDto {
  id: number;
  name: string;
  color: string;
  description?: string;
  isSystemDefined: boolean;
  isArchived: boolean;
}

/**
 * Data Transfer Object for creating a new Focus Session.
 * Based on API documentation: API Endpoints Doc/FocusSessionAPI.md
 */
export interface CreateFocusSessionDto {
  sessionTypeId?: number | null;
  customDurationSeconds?: number | null;
  tagIds?: number[];
  toDoItemId?: number | null;
}

/**
 * Represents the possible states of a focus session.
 */
export type FocusSessionStatus =
  | "Working"
  | "Break"
  | "Completed"
  | "Cancelled";

/**
 * Data Transfer Object for Focus Session responses.
 * Based on API documentation: API Endpoints Doc/FocusSessionAPI.md
 */
export interface FocusSessionResponseDto {
  id: number;
  startTime: string; // ISO 8601 datetime string
  endTime?: string | null; // ISO 8601 datetime string, nullable
  status: FocusSessionStatus;
  currentStateEndTime: string; // ISO 8601 datetime string
  completedCycles: number;
  totalWorkDuration: number; // in seconds
  totalBreakDuration: number; // in seconds
  sessionTypeId?: number | null;
  sessionTypeName?: string | null;
  customDurationSeconds?: number | null;
  tags: TagDto[];
  focusLevel?: number | null; // 1-5
  reflectionNotes?: string | null;
  // Potentially other fields from the API doc if needed by frontend logic later
  // e.g., currentPhaseActualStartTime, userId etc.
  // For now, sticking to the explicitly mentioned "Key fields for UI" and common DTO fields.
}

/**
 * Data Transfer Object for updating the status of a Focus Session (e.g., to Completed or Cancelled).
 * Based on API documentation: API Endpoints Doc/FocusSessionAPI.md
 */
export interface UpdateFocusSessionStatusDto {
  status: "Completed" | "Cancelled"; // Only these two are valid for this DTO
  focusLevel?: number | null; // 1-5, typically for "Completed"
  reflectionNotes?: string | null; // Typically for "Completed"
}
