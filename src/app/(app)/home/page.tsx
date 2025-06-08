"use client";

import { useState, useEffect, useCallback } from "react";
import { useTags, TagDto } from "../../../hooks/useTags";
import useSessionTypes, {
  SessionTypeResponseDto,
} from "../../../hooks/useSessionTypes";
import { useTimerLogic } from "../../../hooks/useTimerLogic";
import { useSessionManagement } from "../../../hooks/useSessionManagement";
import ThemeToggle from "../../../components/ThemeToggle";
import TimerCircle from "../../../components/timer/TimerCircle";
import TaskPanel from "../../../components/timer/TaskPanel";
import BadgePanel from "../../../components/timer/BadgePanel";
import CustomTimerModal from "../../../components/timer/modals/CustomTimerModal";
import OngoingSessionModal from "../../../components/timer/modals/OngoingSessionModal";
import CompletionModal, {
  CompletionModalType,
} from "../../../components/timer/modals/CompletionModal";
import ResetConfirmationModal from "../../../components/timer/modals/ResetConfirmationModal";
import SessionTypeSelector from "../../../components/timer/SessionTypeSelector";
import TagSelector from "../../../components/timer/TagSelector";
import ContextSuggestion from "../../../components/timer/ContextSuggestion";
import FloatingPlansButton from "../../../components/timer/FloatingPlansButton";
import TimerControls from "../../../components/timer/TimerControls";
import KeyboardShortcutsInfo from "../../../components/timer/KeyboardShortcutsInfo";
import MobileTasksSection from "../../../components/timer/MobileTasksSection";
import ManagementPanel from "../../../components/timer/ManagementPanel";

const TimerPage = () => {
  // UI state
  const [timerMode, setTimerMode] = useState<
    "sessionType" | "custom" | "idle" | "customCompleted" | "sessionCompleted"
  >("idle");
  const [selectedSessionTypeId, setSelectedSessionTypeId] = useState<
    number | null
  >(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTimerModalOpen, setCustomTimerModalOpen] = useState(false);
  const [customWorkDurationInput, setCustomWorkDurationInput] = useState(25);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionModalType, setCompletionModalType] =
    useState<CompletionModalType>("workToBreak");
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetConfirmationType, setResetConfirmationType] = useState<
    "session" | "uiBreak"
  >("session");
  const [isTaskPanelExpanded, setIsTaskPanelExpanded] = useState(false); // Start with compact view
  const [isBadgePanelExpanded, setIsBadgePanelExpanded] = useState(true);
  const [isMobileTasksExpanded, setIsMobileTasksExpanded] = useState(true); // Start expanded on mobile
  const [isManagementPanelOpen, setIsManagementPanelOpen] = useState(false);
  const [managementInitialTab, setManagementInitialTab] = useState<
    "tags" | "sessionTypes"
  >("tags");
  const [editingTag, setEditingTag] = useState<TagDto | null>(null);
  const [editingSessionType, setEditingSessionType] =
    useState<SessionTypeResponseDto | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  // Work duration state for custom and session durations
  const [workDurationState, setWorkDurationState] = useState<number>(25 * 60);

  // Hooks
  const { tags: apiTags, isLoadingTags, tagError, mutateTags } = useTags();
  const {
    sessionTypes,
    isLoadingSessionTypes,
    sessionTypeError,
    mutateSessionTypes,
  } = useSessionTypes();

  // Session management hook
  const {
    activeFocusSession,
    showOngoingSessionModal,
    ongoingSessionData,
    createSession,
    cancelSession,
    completeSession,
    transitionState,
    resetSession,
    setActiveFocusSession,
    setShowOngoingSessionModal,
    setOngoingSessionData,
  } = useSessionManagement(
    selectedSessionTypeId,
    selectedTags,
    apiTags || null,
    workDurationState, // Dynamic work duration
    timerMode,
    selectedPlanId ? parseInt(selectedPlanId) : null
  );

  // Forward declarations for handlers
  async function handleLastCycleBreakCompletion() {
    if (!activeFocusSession) return;

    const newSessionData = await transitionState();
    if (newSessionData?.status === "Completed") {
      setCompletionModalType("lastCycleBreakComplete");
      setShowCompletionModal(true);
      setTimerMode("sessionCompleted");
      setSelectedSessionTypeId(null);

      const defaultDurationForDisplay = 25 * 60;
      setUiMinutes(Math.floor(defaultDurationForDisplay / 60));
      setUiSeconds(0);
    }
  }

  async function handleCustomWorkCompletion() {
    if (!activeFocusSession) return;

    const success = await completeSession(activeFocusSession.id);
    if (success) {
      setActiveFocusSession(null);
      setTimerMode("customCompleted");
      setIsRunning(false);
      setCompletionModalType("customWorkComplete");
      setShowCompletionModal(true);
    }
  }

  // Timer logic hook
  const {
    uiMinutes,
    uiSeconds,
    isRunning,
    isUIBreakActive,
    uiBreakMinutes,
    uiBreakSeconds,
    currentProgress,
    setUiMinutes,
    setUiSeconds,
    setIsRunning,
    setWorkDuration,
    startUIBreak,
    resetUIBreak,
  } = useTimerLogic(
    activeFocusSession,
    sessionTypes || null,
    (type: string) => {
      setCompletionModalType(type as CompletionModalType);
      setShowCompletionModal(true);
    },
    handleLastCycleBreakCompletion,
    handleCustomWorkCompletion
  );

  // Timer actions with useCallback
  const startTimer = useCallback(async () => {
    if (isRunning) return;

    if (!activeFocusSession) {
      await createSession();
      // Timer state will be automatically updated by useTimerLogic when session is set
    } else {
      setIsRunning(true);
    }
  }, [isRunning, activeFocusSession, createSession, setIsRunning]);

  const resetTimer = useCallback(async () => {
    if (isUIBreakActive) {
      setResetConfirmationType("uiBreak");
      setShowResetConfirmModal(true);
      return;
    }

    if (activeFocusSession) {
      setResetConfirmationType("session");
      setShowResetConfirmModal(true);
    } else {
      resetState();
    }
  }, [isUIBreakActive, activeFocusSession]);

  const openCustomTimerModal = useCallback(() => {
    if (activeFocusSession && activeFocusSession.customDurationSeconds) {
      setCustomWorkDurationInput(
        Math.floor(activeFocusSession.customDurationSeconds / 60)
      );
    } else if (selectedSessionTypeId && sessionTypes) {
      const currentMode = sessionTypes.find(
        (m) => m.id === selectedSessionTypeId
      );
      if (currentMode) {
        setCustomWorkDurationInput(Math.floor(currentMode.workDuration / 60));
      }
    } else {
      setCustomWorkDurationInput(uiMinutes > 0 ? uiMinutes : 25);
    }
    setCustomTimerModalOpen(true);
  }, [activeFocusSession, selectedSessionTypeId, sessionTypes, uiMinutes]);

  // Ensure timer shows correct default values on mount
  useEffect(() => {
    if (timerMode === "idle" && !activeFocusSession && !isRunning) {
      // Only set if current values are 0 (avoid unnecessary updates)
      if (uiMinutes === 0 && uiSeconds === 0) {
        setUiMinutes(25);
        setUiSeconds(0);
        setWorkDuration(25 * 60);
      }
    }
  }, [timerMode, activeFocusSession, isRunning, uiMinutes, uiSeconds]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        customTimerModalOpen ||
        showOngoingSessionModal ||
        showCompletionModal ||
        showResetConfirmModal
      ) {
        return;
      }

      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.code) {
        case "Space":
          event.preventDefault();
          if (!isRunning && !isUIBreakActive) {
            startTimer();
          }
          break;
        case "KeyR":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (isRunning || activeFocusSession || isUIBreakActive) {
              resetTimer();
            }
          }
          break;
        case "KeyE":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (!isRunning && !activeFocusSession) {
              openCustomTimerModal();
            }
          }
          break;
        case "Escape":
          if (isRunning || activeFocusSession || isUIBreakActive) {
            resetTimer();
          }
          break;
        case "KeyB":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setIsBadgePanelExpanded(!isBadgePanelExpanded);
          }
          break;
        case "KeyT":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setIsTaskPanelExpanded(!isTaskPanelExpanded);
          }
          break;
        case "KeyM":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setIsMobileTasksExpanded(!isMobileTasksExpanded);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    isRunning,
    isUIBreakActive,
    activeFocusSession,
    customTimerModalOpen,
    showOngoingSessionModal,
    showCompletionModal,
    showResetConfirmModal,
    startTimer,
    resetTimer,
    openCustomTimerModal,
    setIsBadgePanelExpanded,
    setIsTaskPanelExpanded,
    setIsMobileTasksExpanded,
  ]);

  const handleConfirmReset = async () => {
    setShowResetConfirmModal(false);
    if (resetConfirmationType === "uiBreak") {
      resetUIBreak();
      setIsRunning(false);
      setTimerMode("idle");
      setWorkDuration(25 * 60);
      setUiMinutes(25);
      setUiSeconds(0);
      setSelectedSessionTypeId(null);
      setSelectedTags([]);
    } else if (resetConfirmationType === "session" && activeFocusSession) {
      const success = await cancelSession(activeFocusSession.id);
      if (success) {
        resetState();
      }
    } else {
      resetState();
    }
  };

  const resetState = () => {
    setIsRunning(false);
    setUiMinutes(25);
    setUiSeconds(0);
    setActiveFocusSession(null);
    setSelectedSessionTypeId(null);
    setSelectedTags([]);
    setTimerMode("idle");
    setWorkDuration(25 * 60);
    resetUIBreak();
  };

  const handleCancelReset = () => {
    setShowResetConfirmModal(false);
  };

  const handleSaveCustomDuration = (customWorkMinutesFromModal: number) => {
    const customDurationSeconds = customWorkMinutesFromModal * 60;

    if (activeFocusSession) {
      setActiveFocusSession(null);
    }

    setTimerMode("custom");
    setSelectedSessionTypeId(null);
    setWorkDuration(customDurationSeconds);
    setWorkDurationState(customDurationSeconds);
    setUiMinutes(Math.floor(customDurationSeconds / 60));
    setUiSeconds(customDurationSeconds % 60);
    setIsRunning(false);
    setCustomTimerModalOpen(false);
  };

  const handleContinueOngoingSession = () => {
    if (!ongoingSessionData) return;

    const sessionData = ongoingSessionData;
    setActiveFocusSession(sessionData);
    setSelectedSessionTypeId(sessionData.sessionTypeId ?? null);

    if (sessionData.sessionTypeId) {
      setTimerMode("sessionType");
      const matchedSessionType = sessionTypes?.find(
        (st) => st.id === sessionData.sessionTypeId
      );
      if (matchedSessionType) {
        setWorkDuration(matchedSessionType.workDuration);
      }
    } else if (sessionData.customDurationSeconds) {
      setTimerMode("custom");
      setWorkDuration(sessionData.customDurationSeconds);
    } else {
      setTimerMode("idle");
    }

    setShowOngoingSessionModal(false);
    setOngoingSessionData(null);
    // Timer state will be automatically updated by useTimerLogic when sessionData is set
  };

  const handleCancelOngoingSession = async () => {
    if (!ongoingSessionData) return;

    if (ongoingSessionData.id) {
      await cancelSession(ongoingSessionData.id);
    }

    resetSession();
    setTimerMode("idle");
    setSelectedSessionTypeId(null);
    const defaultWork = 25 * 60;
    setWorkDuration(defaultWork);
    setUiMinutes(Math.floor(defaultWork / 60));
    setUiSeconds(0);
    setIsRunning(false);

    setShowOngoingSessionModal(false);
    setOngoingSessionData(null);
  };

  const handleStartBreak = async () => {
    setShowCompletionModal(false);
    const newSessionData = await transitionState();

    if (newSessionData?.status === "Completed") {
      setIsRunning(false);
      setTimerMode(
        newSessionData.sessionTypeId ? "sessionCompleted" : "customCompleted"
      );
      const defaultDurationForDisplay = 25 * 60;
      setUiMinutes(Math.floor(defaultDurationForDisplay / 60));
      setUiSeconds(0);
      setSelectedSessionTypeId(null);
      setCompletionModalType("sessionComplete");
      setShowCompletionModal(true);
    }
    // Timer state will be automatically updated by useTimerLogic when newSessionData changes
  };

  const handleCancelSession = async () => {
    if (!activeFocusSession) {
      setShowCompletionModal(false);
      return;
    }

    const shouldComplete = completionModalType === "lastCycleWorkToBreak";

    if (shouldComplete) {
      await completeSession(activeFocusSession.id);
    } else {
      await cancelSession(activeFocusSession.id);
    }

    resetSession();
    setTimerMode("idle");
    setSelectedSessionTypeId(null);
    const defaultWork = 25 * 60;
    setWorkDuration(defaultWork);
    setUiMinutes(Math.floor(defaultWork / 60));
    setUiSeconds(0);
    setIsRunning(false);
    setShowCompletionModal(false);
  };

  const handleOpenTagManagement = () => {
    setManagementInitialTab("tags");
    setEditingTag(null);
    setEditingSessionType(null);
    setIsManagementPanelOpen(true);
  };

  const handleOpenSessionTypeManagement = () => {
    setManagementInitialTab("sessionTypes");
    setEditingTag(null);
    setEditingSessionType(null);
    setIsManagementPanelOpen(true);
  };

  const handleEditTag = (tag: TagDto) => {
    setManagementInitialTab("tags");
    setEditingTag(tag);
    setEditingSessionType(null);
    setIsManagementPanelOpen(true);
  };

  const handleEditSessionType = (sessionType: SessionTypeResponseDto) => {
    setManagementInitialTab("sessionTypes");
    setEditingTag(null);
    setEditingSessionType(sessionType);
    setIsManagementPanelOpen(true);
  };

  const handleStartPlan = (
    planTitle: string,
    minutes: number,
    planId?: string,
    planTagName?: string
  ) => {
    if (isRunning || activeFocusSession !== null) {
      return;
    }
    // Mark the selected ToDo plan
    setSelectedPlanId(planId ?? null);

    // Automatically select the ToDo tag if available
    setSelectedSessionTypeId(null);
    setSelectedTags(planTagName ? [planTagName] : []);

    // Set custom timer for plan duration
    setTimerMode("custom");
    const planDurationSeconds = minutes * 60;
    setWorkDurationState(planDurationSeconds);
    setWorkDuration(planDurationSeconds);
    setUiMinutes(Math.floor(planDurationSeconds / 60));
    setUiSeconds(planDurationSeconds % 60);
    setIsRunning(false);
  };

  const handleCancelPlan = () => {
    if (activeFocusSession) return;
    setSelectedPlanId(null);
    setWorkDurationState(25 * 60);
    resetState();
  };

  const toggleTag = (tagName: string) => {
    // Prevent tag changes during an active focus session or after selecting a plan
    if (isRunning || activeFocusSession !== null || selectedPlanId !== null) {
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleSessionTypeSelect = (sessionType: SessionTypeResponseDto) => {
    if (isRunning || activeFocusSession !== null) {
      return;
    }

    if (selectedSessionTypeId === sessionType.id) {
      // Deselect if same session type is clicked
      setSelectedSessionTypeId(null);
      setTimerMode("idle");
      setWorkDuration(25 * 60);
      setUiMinutes(25);
      setUiSeconds(0);
      setIsRunning(false);
      return;
    }

    // Select new session type
    setSelectedSessionTypeId(sessionType.id);
    setTimerMode("sessionType");
    setWorkDuration(sessionType.workDuration);
    setUiMinutes(Math.floor(sessionType.workDuration / 60));
    setUiSeconds(sessionType.workDuration % 60);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-40">
        <ThemeToggle />
      </div>

      {/* Main Content Layout */}
      <div className="relative w-full">
        {/* Left Side - Tasks Panel */}
        <TaskPanel
          isExpanded={isTaskPanelExpanded}
          onToggleExpanded={() => setIsTaskPanelExpanded(!isTaskPanelExpanded)}
        />

        {/* Center - Timer and Controls */}
        <div className="flex justify-center md:items-center items-start md:min-h-screen min-h-0 md:pt-0 pt-16">
          <div className="max-w-4xl mx-auto px-4 md:py-8 py-4">
            {/* Timer Section */}
            <TimerCircle
              minutes={isUIBreakActive ? uiBreakMinutes : uiMinutes}
              seconds={isUIBreakActive ? uiBreakSeconds : uiSeconds}
              progress={currentProgress}
              isRunning={isRunning}
              isUIBreakActive={isUIBreakActive}
              onStartTimer={startTimer}
              onOpenCustomModal={openCustomTimerModal}
              disabled={isRunning || activeFocusSession !== null}
            />

            {/* Mode Selection */}
            <SessionTypeSelector
              sessionTypes={sessionTypes || null}
              selectedSessionTypeId={selectedSessionTypeId}
              isLoadingSessionTypes={isLoadingSessionTypes}
              sessionTypeError={sessionTypeError}
              isRunning={isRunning}
              activeFocusSession={activeFocusSession}
              onSessionTypeSelect={handleSessionTypeSelect}
              onOpenSessionTypeManagement={handleOpenSessionTypeManagement}
              onEditSessionType={handleEditSessionType}
            />

            {/* Context-Aware Suggestion */}
            <ContextSuggestion
              isRunning={isRunning}
              activeFocusSession={activeFocusSession}
              onStartPlan={handleStartPlan}
              selectedPlanId={selectedPlanId}
              onCancelPlan={handleCancelPlan}
            />

            {/* Tags */}
            <TagSelector
              apiTags={apiTags || null}
              selectedTags={selectedTags}
              isLoadingTags={isLoadingTags}
              tagError={tagError}
              isRunning={isRunning}
              activeFocusSession={activeFocusSession}
              onToggleTag={toggleTag}
              onOpenTagManagement={handleOpenTagManagement}
              onEditTag={handleEditTag}
            />

            {/* Controls */}
            <div className="mt-4">
              <TimerControls
                isRunning={isRunning}
                isUIBreakActive={isUIBreakActive}
                activeFocusSession={activeFocusSession}
                onStartTimer={startTimer}
                onResetTimer={resetTimer}
              />
            </div>

            <div className="hidden md:block">
              <KeyboardShortcutsInfo />
            </div>
          </div>
        </div>

        {/* Mobile Tasks Section */}
        <MobileTasksSection
          isExpanded={isMobileTasksExpanded}
          onToggleExpanded={() =>
            setIsMobileTasksExpanded(!isMobileTasksExpanded)
          }
        />
      </div>

      {/* All Modals */}
      <CustomTimerModal
        isOpen={customTimerModalOpen}
        initialDuration={customWorkDurationInput}
        onClose={() => setCustomTimerModalOpen(false)}
        onSave={handleSaveCustomDuration}
      />

      <OngoingSessionModal
        isOpen={showOngoingSessionModal}
        sessionData={ongoingSessionData}
        sessionTypes={sessionTypes || null}
        onContinue={handleContinueOngoingSession}
        onCancel={handleCancelOngoingSession}
      />

      <CompletionModal
        isOpen={
          showCompletionModal &&
          (activeFocusSession !== null ||
            completionModalType === "customWorkComplete" ||
            completionModalType === "customBreakComplete")
        }
        modalType={completionModalType}
        activeFocusSession={activeFocusSession}
        sessionTypes={sessionTypes || null}
        onStartBreak={handleStartBreak}
        onCancel={handleCancelSession}
        onStartUIBreak={startUIBreak}
      />

      <ResetConfirmationModal
        isOpen={showResetConfirmModal}
        resetType={resetConfirmationType}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />

      {/* Right Side - Badge Panel */}
      <BadgePanel
        isExpanded={isBadgePanelExpanded}
        onToggleExpanded={() => setIsBadgePanelExpanded(!isBadgePanelExpanded)}
      />

      {/* Management Panel */}
      <ManagementPanel
        tags={apiTags || null}
        sessionTypes={sessionTypes || null}
        onTagsUpdate={mutateTags}
        onSessionTypesUpdate={mutateSessionTypes}
        isOpen={isManagementPanelOpen}
        onClose={() => {
          setIsManagementPanelOpen(false);
          setEditingTag(null);
          setEditingSessionType(null);
        }}
        initialTab={managementInitialTab}
        editingTag={editingTag}
        editingSessionType={editingSessionType}
      />

      {/* Floating Plans Button */}
      <FloatingPlansButton
        isRunning={isRunning}
        activeFocusSession={activeFocusSession}
        onStartPlan={handleStartPlan}
      />
    </div>
  );
};

export default TimerPage;
