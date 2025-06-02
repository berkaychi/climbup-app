"use client";

import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { Task } from "../../lib/taskService";

interface MobileTasksSectionProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

// Task detail modal component for mobile
function TaskDetailModal({
  task,
  isOpen,
  onClose,
  taskService,
}: {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  taskService: any; // TODO: Add proper type when available
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
      data-oid="iq2pbon"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/30 w-full max-w-lg max-h-[90vh] overflow-y-auto mx-auto"
        data-oid="v6-.t20"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10"
          data-oid="0j3dpc."
        >
          <h3
            className="text-lg font-bold text-gray-800 dark:text-gray-100"
            data-oid="hlkvr_k"
          >
            Görev Detayları
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            data-oid="592tp83"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="f6ufz82"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="7iwid4z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4" data-oid="mu2s:ir">
          {/* Task Info */}
          <div className="flex items-start gap-3" data-oid=".nsnjft">
            <div
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center"
              data-oid="h_440yd"
            >
              <span className="text-white text-lg" data-oid="s_0m9jh">
                {taskService?.getTaskIcon(task.appTaskDefinition.taskType)}
              </span>
            </div>
            <div className="flex-1 min-w-0" data-oid="hwlyhr:">
              <h4
                className="font-bold text-gray-900 dark:text-gray-50 text-base leading-tight mb-1"
                data-oid="we08c34"
              >
                {task.appTaskDefinition.title}
              </h4>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                data-oid="8gdb.ve"
              >
                {task.appTaskDefinition.description}
              </p>
              <span
                className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${taskService?.getStatusColor(
                  task.status,
                )} bg-gray-100 dark:bg-gray-700`}
                data-oid="do3-:sw"
              >
                {taskService?.getTaskStatusDisplayName(task.status)}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            data-oid="-jo:pz:"
          >
            <div
              className="flex justify-between items-center mb-2"
              data-oid="a2i07ix"
            >
              <span
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                data-oid="n990mva"
              >
                İlerleme
              </span>
              <span
                className="text-lg font-bold text-gray-900 dark:text-gray-50"
                data-oid="__8egzv"
              >
                %{progress}
              </span>
            </div>
            <div
              className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2"
              data-oid="pgk-h23"
            >
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                  progress,
                  task.status,
                )}`}
                style={{ width: `${progress}%` }}
                data-oid="y2kf7rl"
              ></div>
            </div>
            <div
              className="flex justify-between text-xs text-gray-600 dark:text-gray-400"
              data-oid="c0f9g_3"
            >
              <span data-oid=".0r-9ad">
                {taskService?.formatDuration(task.currentProgress)}
              </span>
              <span data-oid="lwhv9hs">
                {taskService?.formatDuration(
                  task.appTaskDefinition.targetProgress,
                )}
              </span>
            </div>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-2 gap-3" data-oid="b7tz4xw">
            <div
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
              data-oid=":8ktquw"
            >
              <div
                className="text-xs text-gray-500 dark:text-gray-400 mb-1"
                data-oid="cylytaz"
              >
                Görev Türü
              </div>
              <div
                className="text-sm font-semibold text-gray-900 dark:text-gray-50"
                data-oid="_j.a2aw"
              >
                {taskService?.getTaskTypeDisplayName(
                  task.appTaskDefinition.taskType,
                ) || "Bilinmeyen"}
              </div>
            </div>
            <div
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
              data-oid="5f29wgr"
            >
              <div
                className="text-xs text-gray-500 dark:text-gray-400 mb-1"
                data-oid="bpj23::"
              >
                Bitiş Tarihi
              </div>
              <div
                className="text-sm font-semibold text-gray-900 dark:text-gray-50"
                data-oid="fwh8way"
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
              data-oid="f3112ed"
            >
              <span className="text-lg" data-oid="on4krrq">
                {isOverdue ? "⚠️" : "⏰"}
              </span>
              <div className="text-sm" data-oid="hh:lq5h">
                <div className="font-semibold" data-oid="0.4b.zt">
                  {isOverdue ? "Süre Doldu!" : "Son Dakika!"}
                </div>
                <div className="text-xs opacity-80" data-oid="ixnmd0m">
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

export default function MobileTasksSection({
  isExpanded,
  onToggleExpanded,
}: MobileTasksSectionProps) {
  const { tasks, isLoading: isLoadingTasks, service: taskService } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  return (
    <div className="xl:hidden mx-4 mb-8" data-oid="a_265nc">
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 relative overflow-hidden"
        data-oid="fo-jw4e"
      >
        {/* Toggle Button */}
        <button
          onClick={onToggleExpanded}
          className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-700/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 dark:border-gray-600/30 p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          title={
            isExpanded ? "Görev panelini küçült" : "Görev panelini genişlet"
          }
          data-oid="v9-lgg."
        >
          <div
            className={`w-4 h-4 flex items-center justify-center transition-transform duration-300 ${
              !isExpanded ? "rotate-180" : ""
            }`}
            data-oid="53i7h_-"
          >
            <svg
              className="w-3 h-3 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="mcen8.1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
                data-oid="mss3.kl"
              />
            </svg>
          </div>
        </button>

        {/* Header - Always Visible */}
        <div
          className="flex items-center justify-between p-4 pb-2"
          data-oid="nsi5dcp"
        >
          <h2
            className="text-lg font-bold text-gray-800 dark:text-gray-100"
            data-oid=".cw0ksi"
          >
            🎯 Günlük Görevler
          </h2>
          {tasks && (
            <span
              className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
              data-oid="zjdy938"
            >
              {(tasks.dailyTasks?.length || 0) +
                (tasks.weeklyTasks?.length || 0)}{" "}
              aktif
            </span>
          )}
        </div>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded
              ? "max-h-[50vh] opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
          data-oid="49-z:i."
        >
          <div
            className="px-4 pb-4 overflow-y-auto max-h-[45vh]"
            data-oid="h77zhvi"
          >
            {isLoadingTasks ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                data-oid="l-rucuj"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse" data-oid="ylalmn9">
                    <div
                      className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"
                      data-oid="92kxin2"
                    ></div>
                  </div>
                ))}
              </div>
            ) : tasks &&
              ((tasks.dailyTasks?.length || 0) > 0 ||
                (tasks.weeklyTasks?.length || 0) > 0) ? (
              <div className="space-y-4" data-oid="b.:xi4d">
                {/* Daily Tasks */}
                {tasks.dailyTasks && tasks.dailyTasks.length > 0 && (
                  <div data-oid="qznd3--">
                    <h3
                      className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 sticky top-0 bg-white/95 dark:bg-gray-800/95 py-1 z-10"
                      data-oid="b01cc73"
                    >
                      📅 Günlük ({tasks.dailyTasks.length})
                    </h3>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      data-oid="hy_mhlh"
                    >
                      {tasks.dailyTasks.slice(0, 4).map((task) => {
                        const progress =
                          taskService?.getProgressPercentage(
                            task.currentProgress,
                            task.appTaskDefinition.targetProgress,
                          ) || 0;
                        const isNearDeadline =
                          taskService?.isNearDeadline(task.dueDate) || false;
                        const isOverdue =
                          taskService?.isOverdue(task.dueDate, task.status) ||
                          false;

                        return (
                          <div
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                              isOverdue
                                ? "border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/20"
                                : isNearDeadline
                                  ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20"
                                  : "border-gray-200 dark:border-gray-600"
                            }`}
                            data-oid="iqlt40f"
                          >
                            <div
                              className="flex items-start justify-between mb-2"
                              data-oid="m2etsb."
                            >
                              <div
                                className="flex items-center min-w-0 flex-1"
                                data-oid="fc__1:f"
                              >
                                <span
                                  className="text-sm mr-2"
                                  data-oid="c4:61hu"
                                >
                                  {taskService?.getTaskIcon(
                                    task.appTaskDefinition.taskType,
                                  )}
                                </span>
                                <div
                                  className="min-w-0 flex-1"
                                  data-oid="ymtyl6-"
                                >
                                  <h4
                                    className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate"
                                    data-oid="u8hhy6x"
                                  >
                                    {task.appTaskDefinition.title}
                                  </h4>
                                </div>
                              </div>
                              <span
                                className="text-xs text-gray-500 dark:text-gray-400"
                                data-oid="na9ikki"
                              >
                                %{progress}
                              </span>
                            </div>
                            <div
                              className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2"
                              data-oid="dotzf0n"
                            >
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                                  progress,
                                  task.status,
                                )}`}
                                style={{ width: `${progress}%` }}
                                data-oid="s_ujgya"
                              ></div>
                            </div>
                            <div
                              className="flex justify-between items-center"
                              data-oid="lbdt64m"
                            >
                              <span
                                className="text-xs text-gray-500 dark:text-gray-400"
                                data-oid="ebd4o9z"
                              >
                                {taskService?.formatDuration(
                                  task.currentProgress,
                                )}{" "}
                                /{" "}
                                {taskService?.formatDuration(
                                  task.appTaskDefinition.targetProgress,
                                )}
                              </span>
                              {isOverdue && (
                                <span
                                  className="text-xs text-red-600 dark:text-red-400"
                                  data-oid="cvv_0do"
                                >
                                  ⚠️
                                </span>
                              )}
                              {isNearDeadline && !isOverdue && (
                                <span
                                  className="text-xs text-yellow-600 dark:text-yellow-400"
                                  data-oid="duw-vbk"
                                >
                                  ⏰
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Weekly Tasks */}
                {tasks.weeklyTasks && tasks.weeklyTasks.length > 0 && (
                  <div data-oid="qi3fhda">
                    <h3
                      className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 sticky top-0 bg-white/95 dark:bg-gray-800/95 py-1 z-10"
                      data-oid="42bg73-"
                    >
                      📊 Haftalık ({tasks.weeklyTasks.length})
                    </h3>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      data-oid="ac4nunl"
                    >
                      {tasks.weeklyTasks.slice(0, 2).map((task) => {
                        const progress =
                          taskService?.getProgressPercentage(
                            task.currentProgress,
                            task.appTaskDefinition.targetProgress,
                          ) || 0;
                        const isNearDeadline =
                          taskService?.isNearDeadline(task.dueDate) || false;
                        const isOverdue =
                          taskService?.isOverdue(task.dueDate, task.status) ||
                          false;

                        return (
                          <div
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm border p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                              isOverdue
                                ? "border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/20"
                                : isNearDeadline
                                  ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20"
                                  : "border-gray-200 dark:border-gray-600"
                            }`}
                            data-oid="t2mke7e"
                          >
                            <div
                              className="flex items-start justify-between mb-2"
                              data-oid="9-g1zbu"
                            >
                              <div
                                className="flex items-center min-w-0 flex-1"
                                data-oid="ic50670"
                              >
                                <span
                                  className="text-sm mr-2"
                                  data-oid="_9qf:_d"
                                >
                                  {taskService?.getTaskIcon(
                                    task.appTaskDefinition.taskType,
                                  )}
                                </span>
                                <div
                                  className="min-w-0 flex-1"
                                  data-oid="3qxcb-u"
                                >
                                  <h4
                                    className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate"
                                    data-oid="il72bgo"
                                  >
                                    {task.appTaskDefinition.title}
                                  </h4>
                                </div>
                              </div>
                              <span
                                className="text-xs text-gray-500 dark:text-gray-400"
                                data-oid="z_g13fv"
                              >
                                %{progress}
                              </span>
                            </div>
                            <div
                              className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2"
                              data-oid="1:5shr0"
                            >
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${taskService?.getProgressBarColor(
                                  progress,
                                  task.status,
                                )}`}
                                style={{ width: `${progress}%` }}
                                data-oid="pjm53j:"
                              ></div>
                            </div>
                            <div
                              className="flex justify-between items-center"
                              data-oid="u2nqsk2"
                            >
                              <span
                                className="text-xs text-gray-500 dark:text-gray-400"
                                data-oid="iwi1h1p"
                              >
                                {taskService?.formatDuration(
                                  task.currentProgress,
                                )}{" "}
                                /{" "}
                                {taskService?.formatDuration(
                                  task.appTaskDefinition.targetProgress,
                                )}
                              </span>
                              {isOverdue && (
                                <span
                                  className="text-xs text-red-600 dark:text-red-400"
                                  data-oid="lo3ytck"
                                >
                                  ⚠️
                                </span>
                              )}
                              {isNearDeadline && !isOverdue && (
                                <span
                                  className="text-xs text-yellow-600 dark:text-yellow-400"
                                  data-oid="nt790ec"
                                >
                                  ⏰
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8" data-oid="2ju577o">
                <div className="text-3xl mb-3" data-oid="b6efvx8">
                  🎯
                </div>
                <p
                  className="text-gray-500 dark:text-gray-400 text-sm mb-1"
                  data-oid="espb-ci"
                >
                  Henüz aktif görev yok
                </p>
                <p
                  className="text-gray-400 dark:text-gray-500 text-xs"
                  data-oid="cwbttrb"
                >
                  Odaklanma seansları başlattığınızda görevler oluşturulacak
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={closeTaskModal}
        taskService={taskService}
        data-oid="llzf-wa"
      />
    </div>
  );
}
