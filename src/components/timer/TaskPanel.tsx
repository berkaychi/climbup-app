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
      task.appTaskDefinition.targetProgress,
    ) || 0;
  const isNearDeadline = taskService?.isNearDeadline(task.dueDate) || false;
  const isOverdue = taskService?.isOverdue(task.dueDate, task.status) || false;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-oid="_qys5vk"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/30 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-auto relative"
        onClick={(e) => e.stopPropagation()}
        data-oid="ygnx5p6"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10"
          data-oid="icx0yu."
        >
          <h3
            className="text-lg font-bold text-gray-800 dark:text-gray-100"
            data-oid="tlvl5rs"
          >
            Görev Detayları
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            data-oid="c5zqwz1"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="pzefp1e"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="u1g8lsy"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4" data-oid="p8v5u3h">
          {/* Task Info */}
          <div className="flex items-start gap-3" data-oid="vj-yuca">
            <div
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center"
              data-oid="9d1c7:j"
            >
              <span className="text-white text-lg" data-oid="aandh8:">
                {taskService?.getTaskIcon(task.appTaskDefinition.taskType)}
              </span>
            </div>
            <div className="flex-1 min-w-0" data-oid="xhk_ap_">
              <h4
                className="font-bold text-gray-900 dark:text-gray-50 text-base leading-tight mb-1"
                data-oid="kyjbj1h"
              >
                {task.appTaskDefinition.title}
              </h4>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                data-oid="2hjr_0_"
              >
                {task.appTaskDefinition.description}
              </p>
              <span
                className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${taskService?.getStatusColor(
                  task.status,
                )} bg-gray-100 dark:bg-gray-700`}
                data-oid="6spjin-"
              >
                {taskService?.getTaskStatusDisplayName(task.status)}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            data-oid="0njin0d"
          >
            <div
              className="flex justify-between items-center mb-2"
              data-oid="vqjh03x"
            >
              <span
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                data-oid="0l63o-s"
              >
                İlerleme
              </span>
              <span
                className="text-lg font-bold text-gray-900 dark:text-gray-50"
                data-oid="ri34nsx"
              >
                %{progress}
              </span>
            </div>
            <div
              className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2"
              data-oid="5gt6wo3"
            >
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                  progress,
                  task.status,
                )}`}
                style={{ width: `${progress}%` }}
                data-oid="q767_xl"
              ></div>
            </div>
            <div
              className="flex justify-between text-xs text-gray-600 dark:text-gray-400"
              data-oid="uub:6:r"
            >
              <span data-oid="a.j0jaq">
                {taskService?.formatDuration(task.currentProgress)}
              </span>
              <span data-oid="dwzsm-h">
                {taskService?.formatDuration(
                  task.appTaskDefinition.targetProgress,
                )}
              </span>
            </div>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-2 gap-3" data-oid="egw7yth">
            <div
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
              data-oid="9z5d4bd"
            >
              <div
                className="text-xs text-gray-500 dark:text-gray-400 mb-1"
                data-oid="r44_yzc"
              >
                Görev Türü
              </div>
              <div
                className="text-sm font-semibold text-gray-900 dark:text-gray-50"
                data-oid=".ewcm9o"
              >
                {taskService?.getTaskTypeDisplayName(
                  task.appTaskDefinition.taskType,
                ) || "Bilinmeyen"}
              </div>
            </div>
            <div
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
              data-oid="m49b:rf"
            >
              <div
                className="text-xs text-gray-500 dark:text-gray-400 mb-1"
                data-oid="j11yoaf"
              >
                Bitiş Tarihi
              </div>
              <div
                className="text-sm font-semibold text-gray-900 dark:text-gray-50"
                data-oid="9ywqevf"
              >
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
              data-oid="zlrt7j7"
            >
              <span className="text-lg" data-oid="-013uvb">
                {isOverdue ? "⚠️" : "⏰"}
              </span>
              <div className="text-sm" data-oid="re14wmd">
                <div className="font-semibold" data-oid="d1vupeo">
                  {isOverdue ? "Süre Doldu!" : "Son Dakika!"}
                </div>
                <div className="text-xs opacity-80" data-oid="edc8vnq">
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
      data-oid="tcjb3ot"
    >
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 p-4 h-full"
        data-oid="9.xehtx"
      >
        <div
          className="flex items-center justify-between mb-4"
          data-oid="nk53npd"
        >
          <h2
            className={`font-bold text-gray-800 dark:text-gray-100 ${
              isExpanded ? "text-lg" : "text-base"
            }`}
            data-oid=":1o7fqv"
          >
            🎯 {isExpanded ? "Günlük Görevler" : "Görevler"}
          </h2>
          <div className="flex items-center gap-2" data-oid="-g4lclq">
            {tasks && (
              <span
                className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                data-oid="_bez71d"
              >
                {(tasks.dailyTasks?.length || 0) +
                  (tasks.weeklyTasks?.length || 0)}{" "}
                aktif
              </span>
            )}
            <button
              onClick={onToggleExpanded}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isExpanded ? "Daralt" : "Genişlet"}
              data-oid="oao.0yj"
            >
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="a7ngmfy"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                  data-oid="rf_wr98"
                />
              </svg>
            </button>
          </div>
        </div>

        {isLoadingTasks ? (
          <div className="space-y-3" data-oid="2rcxc-l">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse" data-oid="ti86ipk">
                <div
                  className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${
                    isExpanded ? "h-20" : "h-12"
                  }`}
                  data-oid="x_pck1o"
                ></div>
              </div>
            ))}
          </div>
        ) : tasks &&
          ((tasks.dailyTasks?.length || 0) > 0 ||
            (tasks.weeklyTasks?.length || 0) > 0) ? (
          <div
            className="space-y-3 h-[calc(100%-60px)] overflow-y-auto"
            data-oid="k_ww-rn"
          >
            {/* Daily Tasks */}
            {tasks.dailyTasks && tasks.dailyTasks.length > 0 && (
              <>
                <h3
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center mb-2 sticky top-0 bg-white/95 dark:bg-gray-800/95 py-1"
                  data-oid="g4s9giq"
                >
                  📅 Günlük ({tasks.dailyTasks.length})
                </h3>
                {tasks.dailyTasks.map((task) => {
                  const progress =
                    taskService?.getProgressPercentage(
                      task.currentProgress,
                      task.appTaskDefinition.targetProgress,
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
                        data-oid="c7e5o2s"
                      >
                        <div
                          className="flex items-center justify-between"
                          data-oid="4v18kk3"
                        >
                          <div
                            className="flex items-center min-w-0 flex-1"
                            data-oid="5mkm0iz"
                          >
                            <span
                              className="text-xs mr-1.5 flex-shrink-0"
                              data-oid=".o3jpoe"
                            >
                              {taskService?.getTaskIcon(
                                task.appTaskDefinition.taskType,
                              )}
                            </span>
                            <span
                              className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate"
                              data-oid="nqkuu_x"
                            >
                              {task.appTaskDefinition.title}
                            </span>
                          </div>
                          <div
                            className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2"
                            data-oid="wteycya"
                          >
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress,
                            )}
                          </div>
                        </div>
                        {(isOverdue || isNearDeadline) && (
                          <div
                            className="mt-1 text-xs flex justify-end"
                            data-oid="bmqoek1"
                          >
                            {isOverdue && (
                              <span
                                className="text-red-600 dark:text-red-400"
                                data-oid="gsjm2ey"
                              >
                                ⚠️
                              </span>
                            )}
                            {isNearDeadline && !isOverdue && (
                              <span
                                className="text-yellow-600 dark:text-yellow-400"
                                data-oid="1z6.1li"
                              >
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
                      data-oid="vhk8.vh"
                    >
                      <div
                        className="flex items-start justify-between mb-2"
                        data-oid="_mwbz7b"
                      >
                        <div
                          className="flex items-center min-w-0 flex-1"
                          data-oid="pnc:ymk"
                        >
                          <span
                            className="text-sm mr-2 flex-shrink-0"
                            data-oid="2bl2sa5"
                          >
                            {taskService?.getTaskIcon(
                              task.appTaskDefinition.taskType,
                            )}
                          </span>
                          <div className="min-w-0 flex-1" data-oid="jd0ojr-">
                            <h4
                              className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate"
                              data-oid="aaf2ym1"
                            >
                              {task.appTaskDefinition.title}
                            </h4>
                            <p
                              className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1"
                              data-oid="kv3v3m1"
                            >
                              {task.appTaskDefinition.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${taskService?.getStatusColor(
                            task.status,
                          )}`}
                          data-oid="boa34j9"
                        >
                          {taskService?.getTaskStatusDisplayName(task.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2" data-oid="xb37q1-">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="y6zi_3d"
                        >
                          <span
                            className="text-xs font-medium text-gray-700 dark:text-gray-300"
                            data-oid="lw21qxu"
                          >
                            %{progress}
                          </span>
                          <span
                            className="text-xs text-gray-600 dark:text-gray-400"
                            data-oid="vluulcr"
                          >
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress,
                            )}
                          </span>
                        </div>
                        <div
                          className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5"
                          data-oid="cqoe0rt"
                        >
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                              progress,
                              task.status,
                            )}`}
                            style={{ width: `${progress}%` }}
                            data-oid="ql:hlt2"
                          ></div>
                        </div>
                      </div>

                      {/* Due Date and Warning */}
                      <div
                        className="flex justify-between items-center"
                        data-oid="qf9ht8f"
                      >
                        <div
                          className="text-xs text-gray-500 dark:text-gray-400"
                          data-oid="ufa4l.1"
                        >
                          {new Date(task.dueDate).toLocaleString("tr-TR", {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })}
                        </div>
                        {isOverdue && (
                          <span
                            className="text-xs text-red-600 dark:text-red-400 font-medium"
                            data-oid="74l1p88"
                          >
                            ⚠️
                          </span>
                        )}
                        {isNearDeadline && !isOverdue && (
                          <span
                            className="text-xs text-yellow-600 dark:text-yellow-400 font-medium"
                            data-oid="ba2lrgu"
                          >
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
                <h3
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center mb-2 mt-4 sticky top-0 bg-white/95 dark:bg-gray-800/95 py-1"
                  data-oid="f6b5ota"
                >
                  📊 Haftalık ({tasks.weeklyTasks.length})
                </h3>
                {tasks.weeklyTasks.map((task) => {
                  const progress =
                    taskService?.getProgressPercentage(
                      task.currentProgress,
                      task.appTaskDefinition.targetProgress,
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
                        data-oid="ffy4kcw"
                      >
                        <div
                          className="flex items-center justify-between"
                          data-oid="rbofjzi"
                        >
                          <div
                            className="flex items-center min-w-0 flex-1"
                            data-oid="2:n:1o:"
                          >
                            <span
                              className="text-xs mr-1.5 flex-shrink-0"
                              data-oid="0_sv8p8"
                            >
                              {taskService?.getTaskIcon(
                                task.appTaskDefinition.taskType,
                              )}
                            </span>
                            <span
                              className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate"
                              data-oid="-d5x4.a"
                            >
                              {task.appTaskDefinition.title}
                            </span>
                          </div>
                          <div
                            className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2"
                            data-oid="zq5jv5e"
                          >
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress,
                            )}
                          </div>
                        </div>
                        {(isOverdue || isNearDeadline) && (
                          <div
                            className="mt-1 text-xs flex justify-end"
                            data-oid="z8wzc43"
                          >
                            {isOverdue && (
                              <span
                                className="text-red-600 dark:text-red-400"
                                data-oid="7s-fk5u"
                              >
                                ⚠️
                              </span>
                            )}
                            {isNearDeadline && !isOverdue && (
                              <span
                                className="text-yellow-600 dark:text-yellow-400"
                                data-oid="1oztwgu"
                              >
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
                      data-oid="g0qdy0f"
                    >
                      <div
                        className="flex items-start justify-between mb-2"
                        data-oid="vf7q3km"
                      >
                        <div
                          className="flex items-center min-w-0 flex-1"
                          data-oid="0i4n49m"
                        >
                          <span
                            className="text-sm mr-2 flex-shrink-0"
                            data-oid="xgg11-4"
                          >
                            {taskService?.getTaskIcon(
                              task.appTaskDefinition.taskType,
                            )}
                          </span>
                          <div className="min-w-0 flex-1" data-oid="00b29xp">
                            <h4
                              className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate"
                              data-oid="k3-xwdl"
                            >
                              {task.appTaskDefinition.title}
                            </h4>
                            <p
                              className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1"
                              data-oid="fad0y7z"
                            >
                              {task.appTaskDefinition.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${taskService?.getStatusColor(
                            task.status,
                          )}`}
                          data-oid="m:5ej5r"
                        >
                          {taskService?.getTaskStatusDisplayName(task.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2" data-oid="1mbrdnu">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="0ug-thk"
                        >
                          <span
                            className="text-xs font-medium text-gray-700 dark:text-gray-300"
                            data-oid="l-scobn"
                          >
                            %{progress}
                          </span>
                          <span
                            className="text-xs text-gray-600 dark:text-gray-400"
                            data-oid="nm52by1"
                          >
                            {taskService?.formatDuration(task.currentProgress)}{" "}
                            /{" "}
                            {taskService?.formatDuration(
                              task.appTaskDefinition.targetProgress,
                            )}
                          </span>
                        </div>
                        <div
                          className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5"
                          data-oid="7j-0:75"
                        >
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                              progress,
                              task.status,
                            )}`}
                            style={{ width: `${progress}%` }}
                            data-oid="wgxmohv"
                          ></div>
                        </div>
                      </div>

                      {/* Due Date and Warning */}
                      <div
                        className="flex justify-between items-center"
                        data-oid="q:qvrba"
                      >
                        <div
                          className="text-xs text-gray-500 dark:text-gray-400"
                          data-oid="gmn-y1m"
                        >
                          {new Date(task.dueDate).toLocaleString("tr-TR", {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          })}
                        </div>
                        {isOverdue && (
                          <span
                            className="text-xs text-red-600 dark:text-red-400 font-medium"
                            data-oid="6qxfpin"
                          >
                            ⚠️
                          </span>
                        )}
                        {isNearDeadline && !isOverdue && (
                          <span
                            className="text-xs text-yellow-600 dark:text-yellow-400 font-medium"
                            data-oid="b2004:."
                          >
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
          <div className="text-center py-8" data-oid="ul6ht5a">
            <div className="text-3xl mb-3" data-oid="fvydc2z">
              🎯
            </div>
            <p
              className="text-gray-500 dark:text-gray-400 text-sm mb-1"
              data-oid="clht4kd"
            >
              Henüz aktif görev yok
            </p>
            <p
              className="text-gray-400 dark:text-gray-500 text-xs"
              data-oid="57ep-ag"
            >
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
        data-oid="t07tlk4"
      />
    </div>
  );
}
