"use client";

import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { Task, TaskService } from "../../lib/taskService";

interface TaskPanelProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

// Task detail modal component
function TaskDetailModal({
  task,
  isOpen,
  onClose,
  taskService,
}: {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  taskService: TaskService;
}) {
  if (!isOpen || !task) return null;

  const progress =
    taskService?.getProgressPercentage(
      task.currentProgress,
      task.appTaskDefinition.targetProgress
    ) || 0;
  const isNearDeadline = taskService?.isNearDeadline(task.dueDate) || false;
  const isOverdue = taskService?.isOverdue(task.dueDate, task.status) || false;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/30 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Görev Detayları
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Task Info */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">
                {taskService?.getTaskIcon(task.appTaskDefinition.taskType)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-gray-50 text-base leading-tight mb-1">
                {task.appTaskDefinition.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {task.appTaskDefinition.description}
              </p>
              <span
                className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${taskService?.getStatusColor(
                  task.status
                )} bg-gray-100 dark:bg-gray-700`}
              >
                {taskService?.getTaskStatusDisplayName(task.status)}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                İlerleme
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
                %{progress}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                  progress,
                  task.status
                )}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{taskService?.formatDuration(task.currentProgress)}</span>
              <span>
                {taskService?.formatDuration(
                  task.appTaskDefinition.targetProgress
                )}
              </span>
            </div>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Görev Türü
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                {taskService?.getTaskTypeDisplayName(
                  task.appTaskDefinition.taskType
                ) || "Bilinmeyen"}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Bitiş Tarihi
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                {new Date(task.dueDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(isOverdue || isNearDeadline) && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                isOverdue
                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
              }`}
            >
              <span className="text-lg">{isOverdue ? "⚠️" : "⏰"}</span>
              <div className="text-sm">
                <div className="font-semibold">
                  {isOverdue ? "Süre Doldu!" : "Son Dakika!"}
                </div>
                <div className="text-xs opacity-80">
                  {isOverdue
                    ? "Bu görevin süresi geçmiş"
                    : "Görev bitiş tarihine yakın"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TaskPanel({
  isExpanded,
  onToggleExpanded,
}: TaskPanelProps) {
  const { tasks, isLoading: isLoadingTasks, service: taskService } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  return (
    <div
      className={`hidden xl:block fixed left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-30 ${
        isExpanded ? "w-80 h-[80vh]" : "w-64 h-[50vh]"
      }`}
    >
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`font-bold text-gray-800 dark:text-gray-100 ${
              isExpanded ? "text-lg" : "text-base"
            }`}
          >
            🎯 {isExpanded ? "Günlük Görevler" : "Görevler"}
          </h2>
          <div className="flex items-center gap-2">
            {tasks && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {(tasks.dailyTasks?.length || 0) +
                  (tasks.weeklyTasks?.length || 0)}{" "}
                aktif
              </span>
            )}
            <button
              onClick={onToggleExpanded}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isExpanded ? "Daralt" : "Genişlet"}
            >
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {isLoadingTasks ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${
                    isExpanded ? "h-20" : "h-12"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        ) : tasks &&
          ((tasks.dailyTasks?.length || 0) > 0 ||
            (tasks.weeklyTasks?.length || 0) > 0) ? (
          <div className="space-y-3 h-[calc(100%-60px)] overflow-y-auto">
            {/* Daily Tasks */}
            {tasks.dailyTasks && tasks.dailyTasks.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center mb-2 sticky top-0 bg-white/95 dark:bg-gray-800/95 py-1">
                  📅 Günlük ({tasks.dailyTasks.length})
                </h3>
                {tasks.dailyTasks.map((task) => {
                  const progress =
                    taskService?.getProgressPercentage(
                      task.currentProgress,
                      task.appTaskDefinition.targetProgress
                    ) || 0;
                  const isNearDeadline =
                    taskService?.isNearDeadline(task.dueDate) || false;
                  const isOverdue =
                    taskService?.isOverdue(task.dueDate, task.status) || false;

                  if (!isExpanded) {
                    // Compact view - clickable
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border p-2 transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5 ${
                          isOverdue
                            ? "border-red-300 dark:border-red-600"
                            : isNearDeadline
                            ? "border-yellow-300 dark:border-yellow-600"
                            : "border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0 flex-1">
                            <span className="text-xs mr-1.5 flex-shrink-0">
                              {taskService?.getTaskIcon(
                                task.appTaskDefinition.taskType
                              )}
                            </span>
                            <span className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate">
                              {task.appTaskDefinition.title}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2">
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress
                            )}
                          </div>
                        </div>
                        {(isOverdue || isNearDeadline) && (
                          <div className="mt-1 text-xs flex justify-end">
                            {isOverdue && (
                              <span className="text-red-600 dark:text-red-400">
                                ⚠️
                              </span>
                            )}
                            {isNearDeadline && !isOverdue && (
                              <span className="text-yellow-600 dark:text-yellow-400">
                                ⏰
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Expanded view
                  return (
                    <div
                      key={task.id}
                      className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                        isOverdue
                          ? "border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/20"
                          : isNearDeadline
                          ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center min-w-0 flex-1">
                          <span className="text-sm mr-2 flex-shrink-0">
                            {taskService?.getTaskIcon(
                              task.appTaskDefinition.taskType
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate">
                              {task.appTaskDefinition.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                              {task.appTaskDefinition.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${taskService?.getStatusColor(
                            task.status
                          )}`}
                        >
                          {taskService?.getTaskStatusDisplayName(task.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            %{progress}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                              progress,
                              task.status
                            )}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Due Date and Warning */}
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(task.dueDate).toLocaleString("tr-TR", {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })}
                        </div>
                        {isOverdue && (
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                            ⚠️
                          </span>
                        )}
                        {isNearDeadline && !isOverdue && (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                            ⏰
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Weekly Tasks */}
            {tasks.weeklyTasks && tasks.weeklyTasks.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center mb-2 mt-4 sticky top-0 bg-white/95 dark:bg-gray-800/95 py-1">
                  📊 Haftalık ({tasks.weeklyTasks.length})
                </h3>
                {tasks.weeklyTasks.map((task) => {
                  const progress =
                    taskService?.getProgressPercentage(
                      task.currentProgress,
                      task.appTaskDefinition.targetProgress
                    ) || 0;
                  const isNearDeadline =
                    taskService?.isNearDeadline(task.dueDate) || false;
                  const isOverdue =
                    taskService?.isOverdue(task.dueDate, task.status) || false;

                  if (!isExpanded) {
                    // Compact view - clickable
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border p-2 transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5 ${
                          isOverdue
                            ? "border-red-300 dark:border-red-600"
                            : isNearDeadline
                            ? "border-yellow-300 dark:border-yellow-600"
                            : "border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0 flex-1">
                            <span className="text-xs mr-1.5 flex-shrink-0">
                              {taskService?.getTaskIcon(
                                task.appTaskDefinition.taskType
                              )}
                            </span>
                            <span className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate">
                              {task.appTaskDefinition.title}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2">
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress
                            )}
                          </div>
                        </div>
                        {(isOverdue || isNearDeadline) && (
                          <div className="mt-1 text-xs flex justify-end">
                            {isOverdue && (
                              <span className="text-red-600 dark:text-red-400">
                                ⚠️
                              </span>
                            )}
                            {isNearDeadline && !isOverdue && (
                              <span className="text-yellow-600 dark:text-yellow-400">
                                ⏰
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Expanded view (same as daily tasks expanded view)
                  return (
                    <div
                      key={task.id}
                      className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                        isOverdue
                          ? "border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/20"
                          : isNearDeadline
                          ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center min-w-0 flex-1">
                          <span className="text-sm mr-2 flex-shrink-0">
                            {taskService?.getTaskIcon(
                              task.appTaskDefinition.taskType
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate">
                              {task.appTaskDefinition.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                              {task.appTaskDefinition.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${taskService?.getStatusColor(
                            task.status
                          )}`}
                        >
                          {taskService?.getTaskStatusDisplayName(task.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            %{progress}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                              progress,
                              task.status
                            )}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Due Date and Warning */}
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(task.dueDate).toLocaleString("tr-TR", {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })}
                        </div>
                        {isOverdue && (
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                            ⚠️
                          </span>
                        )}
                        {isNearDeadline && !isOverdue && (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                            ⏰
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🎯</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              Henüz aktif görev yok
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              Odaklanma seansları başlattığınızda görevler oluşturulacak
            </p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={closeTaskModal}
        taskService={taskService}
      />
    </div>
  );
}
