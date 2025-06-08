"use client";

import { useState, useEffect } from "react";
import { useAuth, User } from "../context/AuthContext";

interface AuthActions {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  updateTokensAndUser: (
    newAccessToken: string,
    newRefreshToken: string,
    userData: User
  ) => void;
  logout: () => void;
}
import { TagDto } from "./useTags";
import {
  FocusSessionResponseDto,
  CreateFocusSessionDto,
  UpdateFocusSessionStatusDto,
} from "../types/focusSession";
import { fetchWithAuth } from "../lib/authFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSessionManagement = (
  selectedSessionTypeId: number | null,
  selectedTags: string[],
  apiTags: TagDto[] | null,
  workDuration: number,
  timerMode: string,
  toDoItemId: number | null = null
) => {
  const [activeFocusSession, setActiveFocusSession] =
    useState<FocusSessionResponseDto | null>(null);
  const [showOngoingSessionModal, setShowOngoingSessionModal] = useState(false);
  const [ongoingSessionData, setOngoingSessionData] =
    useState<FocusSessionResponseDto | null>(null);

  const authContext = useAuth();

  // Fetch ongoing session on load
  useEffect(() => {
    const fetchOngoingSession = async () => {
      if (!authContext.user || !API_BASE_URL) return;

      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/api/FocusSession/ongoing`,
          {},
          authContext as AuthActions
        );

        if (response.ok) {
          const sessionData: FocusSessionResponseDto = await response.json();
          setOngoingSessionData(sessionData);
          setShowOngoingSessionModal(true);
        } else if (response.status === 404) {
          setActiveFocusSession(null);
        } else {
          console.error(
            "Failed to fetch ongoing session:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching ongoing session:", error);
      }
    };

    fetchOngoingSession();
  }, [authContext, API_BASE_URL]);

  const createSession = async (): Promise<FocusSessionResponseDto | null> => {
    if (!authContext || !API_BASE_URL) {
      console.error("Auth context or API base URL not available");
      return null;
    }

    try {
      const tagIdsToSubmit = selectedTags
        .map(
          (tagName) => apiTags?.find((apiTag) => apiTag.name === tagName)?.id
        )
        .filter((id) => id !== undefined) as number[];

      let createDto: CreateFocusSessionDto;

      if (timerMode === "sessionType" && selectedSessionTypeId) {
        createDto = {
          sessionTypeId: selectedSessionTypeId,
          tagIds: tagIdsToSubmit.length > 0 ? tagIdsToSubmit : undefined,
        };
      } else if (timerMode === "custom") {
        createDto = {
          customDurationSeconds: workDuration,
          tagIds: tagIdsToSubmit.length > 0 ? tagIdsToSubmit : undefined,
        };
      } else if (timerMode === "idle") {
        createDto = {
          customDurationSeconds: 1500, // 25 minutes
          tagIds: tagIdsToSubmit.length > 0 ? tagIdsToSubmit : undefined,
        };
      } else {
        console.error("Cannot start timer: No valid session mode selected");
        return null;
      }

      // Attach ToDo Item ID if provided
      if (toDoItemId != null) {
        createDto.toDoItemId = toDoItemId;
      }

      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/FocusSession`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createDto),
        },
        authContext as AuthActions
      );

      if (response.ok) {
        const responseData = await response.json();
        // Extract the actual session data from the nested response
        const newSessionData: FocusSessionResponseDto = responseData.data;
        setActiveFocusSession(newSessionData);
        return newSessionData;
      } else {
        console.error("Failed to create focus session:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error creating focus session:", error);
      return null;
    }
  };

  const cancelSession = async (sessionId: number) => {
    if (!authContext || !API_BASE_URL) return false;

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/FocusSession/${sessionId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Cancelled",
          } as UpdateFocusSessionStatusDto),
        },
        authContext as AuthActions
      );

      return response.ok;
    } catch (error) {
      console.error("Error cancelling session:", error);
      return false;
    }
  };

  const completeSession = async (sessionId: number) => {
    if (!authContext || !API_BASE_URL) return false;

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/FocusSession/${sessionId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Completed",
          } as UpdateFocusSessionStatusDto),
        },
        authContext as AuthActions
      );

      return response.ok;
    } catch (error) {
      console.error("Error completing session:", error);
      return false;
    }
  };

  const transitionState = async (): Promise<FocusSessionResponseDto | null> => {
    if (!activeFocusSession || !authContext || !API_BASE_URL) return null;

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/api/FocusSession/${activeFocusSession.id}/transition-state`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        authContext as AuthActions
      );

      if (response.ok) {
        const responseData = await response.json();
        // Extract the actual session data from the nested response
        const newSessionData: FocusSessionResponseDto = responseData.data;
        setActiveFocusSession(newSessionData);
        return newSessionData;
      } else {
        console.error("Failed to transition state:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error transitioning state:", error);
      return null;
    }
  };

  const resetSession = () => {
    setActiveFocusSession(null);
  };

  return {
    // State
    activeFocusSession,
    showOngoingSessionModal,
    ongoingSessionData,

    // Actions
    createSession,
    cancelSession,
    completeSession,
    transitionState,
    resetSession,
    setActiveFocusSession,
    setShowOngoingSessionModal,
    setOngoingSessionData,
  };
};
