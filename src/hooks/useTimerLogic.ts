"use client";

import { useState, useRef, useEffect } from "react";
import { FocusSessionResponseDto } from "../types/focusSession";
import { SessionTypeResponseDto } from "./useSessionTypes";

export const useTimerLogic = (
  activeFocusSession: FocusSessionResponseDto | null,
  sessionTypes: SessionTypeResponseDto[] | null,
  onSessionComplete: (type: string) => void,
  onBreakComplete: () => void,
  onCustomWorkComplete: () => void
) => {
  // Timer states with safe defaults
  const [uiMinutes, setUiMinutes] = useState(25);
  const [uiSeconds, setUiSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration, setWorkDuration] = useState(25 * 60);

  // UI-only break timer states
  const [isUIBreakActive, setIsUIBreakActive] = useState(false);
  const [uiBreakMinutes, setUIBreakMinutes] = useState(5);
  const [uiBreakSeconds, setUIBreakSeconds] = useState(0);
  const [uiBreakDuration, setUIBreakDuration] = useState(5 * 60);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Main timer effect for active sessions
  useEffect(() => {
    if (
      isRunning &&
      activeFocusSession &&
      activeFocusSession.currentStateEndTime
    ) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        const endTime = new Date(
          activeFocusSession.currentStateEndTime
        ).getTime();
        const now = Date.now();
        const remainingMilliseconds = endTime - now;

        if (remainingMilliseconds <= 0) {
          setUiMinutes(0);
          setUiSeconds(0);
          setIsRunning(false);

          if (activeFocusSession?.status === "Working") {
            // Check if this is a custom duration session
            if (
              !activeFocusSession.sessionTypeId &&
              activeFocusSession.customDurationSeconds
            ) {
              onCustomWorkComplete();
              return;
            }

            // Check if this is the last cycle for session types
            const isLastCycle =
              activeFocusSession.sessionTypeId &&
              sessionTypes &&
              (() => {
                const sessionType = sessionTypes.find(
                  (st) => st.id === activeFocusSession.sessionTypeId
                );
                if (sessionType?.numberOfCycles) {
                  return (
                    activeFocusSession.completedCycles >=
                    sessionType.numberOfCycles - 1
                  );
                }
                return false;
              })();

            if (isLastCycle) {
              onSessionComplete("lastCycleWorkToBreak");
            } else {
              onSessionComplete("workToBreak");
            }
          } else if (activeFocusSession?.status === "Break") {
            const isLastCycleBreak =
              activeFocusSession.sessionTypeId &&
              sessionTypes &&
              (() => {
                const sessionType = sessionTypes.find(
                  (st) => st.id === activeFocusSession.sessionTypeId
                );
                if (sessionType?.numberOfCycles) {
                  return (
                    activeFocusSession.completedCycles >=
                    sessionType.numberOfCycles - 1
                  );
                }
                return false;
              })();

            if (isLastCycleBreak) {
              setIsRunning(false);
              onBreakComplete();
            } else {
              onSessionComplete("breakToWork");
            }
          } else {
            onSessionComplete("sessionComplete");
          }

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          const remainingSecondsTotal = Math.floor(
            remainingMilliseconds / 1000
          );
          setUiMinutes(Math.floor(remainingSecondsTotal / 60));
          setUiSeconds(remainingSecondsTotal % 60);
        }
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isRunning,
    activeFocusSession,
    sessionTypes,
    onSessionComplete,
    onBreakComplete,
    onCustomWorkComplete,
  ]);

  // Session state change effect - starts timer when session transitions
  useEffect(() => {
    if (activeFocusSession && activeFocusSession.currentStateEndTime) {
      const endTime = new Date(
        activeFocusSession.currentStateEndTime
      ).getTime();
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));

      // Always update timer state when session changes
      if (remainingSeconds > 0) {
        setUiMinutes(Math.floor(remainingSeconds / 60));
        setUiSeconds(remainingSeconds % 60);
        if (!isRunning) {
          setIsRunning(true);
        }
      } else {
        // Session time has already expired
        setUiMinutes(0);
        setUiSeconds(0);
        setIsRunning(false);
      }
    }
  }, [activeFocusSession]);

  // UI-only break timer effect
  useEffect(() => {
    if (isUIBreakActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setUIBreakMinutes((prevMinutes) => {
          setUIBreakSeconds((prevSeconds) => {
            if (prevSeconds > 0) {
              return prevSeconds - 1;
            } else if (prevMinutes > 0) {
              return 59;
            } else {
              setIsUIBreakActive(false);
              onSessionComplete("customBreakComplete");
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              return 0;
            }
          });
          if (uiBreakSeconds === 0 && prevMinutes > 0) {
            return prevMinutes - 1;
          }
          return prevMinutes;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isUIBreakActive, uiBreakSeconds, isRunning, onSessionComplete]);

  const startUIBreak = (breakDurationMinutes: number) => {
    const breakDurationSeconds = breakDurationMinutes * 60;
    setUIBreakDuration(breakDurationSeconds);
    setUIBreakMinutes(breakDurationMinutes);
    setUIBreakSeconds(0);
    setIsUIBreakActive(true);
  };

  const resetUIBreak = () => {
    setIsUIBreakActive(false);
    setUIBreakMinutes(5);
    setUIBreakSeconds(0);
    setUIBreakDuration(5 * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Progress calculations with NaN protection
  const safeUiMinutes = isNaN(uiMinutes) ? 0 : uiMinutes;
  const safeUiSeconds = isNaN(uiSeconds) ? 0 : uiSeconds;
  const safeWorkDuration =
    isNaN(workDuration) || workDuration <= 0 ? 25 * 60 : workDuration;

  const progress =
    safeWorkDuration > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((safeWorkDuration - (safeUiMinutes * 60 + safeUiSeconds)) /
              safeWorkDuration) *
              100
          )
        )
      : 0;

  const safeUiBreakMinutes = isNaN(uiBreakMinutes) ? 0 : uiBreakMinutes;
  const safeUiBreakSeconds = isNaN(uiBreakSeconds) ? 0 : uiBreakSeconds;
  const safeUiBreakDuration =
    isNaN(uiBreakDuration) || uiBreakDuration <= 0 ? 5 * 60 : uiBreakDuration;

  const uiBreakProgress =
    isUIBreakActive && safeUiBreakDuration > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((safeUiBreakDuration -
              (safeUiBreakMinutes * 60 + safeUiBreakSeconds)) /
              safeUiBreakDuration) *
              100
          )
        )
      : 0;

  const currentProgress = isUIBreakActive ? uiBreakProgress : progress;

  return {
    // Timer state (with safe values)
    uiMinutes: safeUiMinutes,
    uiSeconds: safeUiSeconds,
    isRunning,
    workDuration: safeWorkDuration,

    // UI Break state (with safe values)
    isUIBreakActive,
    uiBreakMinutes: safeUiBreakMinutes,
    uiBreakSeconds: safeUiBreakSeconds,
    uiBreakDuration: safeUiBreakDuration,

    // Progress
    progress,
    uiBreakProgress,
    currentProgress,

    // Actions
    setUiMinutes,
    setUiSeconds,
    setIsRunning,
    setWorkDuration,
    startUIBreak,
    resetUIBreak,

    // Interval ref for cleanup
    intervalRef,
  };
};
