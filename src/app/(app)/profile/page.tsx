"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";

import {
  useUserStatsSummary,
  useTagFocusStats,
  useWeeklyProgress,
} from "@/hooks/useStatistics";
import { usePlans } from "@/hooks/usePlans";
import { format, subDays } from "date-fns";
import { tr } from "date-fns/locale";
import { useUserProfile } from "@/hooks/useUserProfile";
import EditProfileModal from "@/components/EditProfileModal";
import UploadPhotoModal from "@/components/UploadPhotoModal";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const router = useRouter();
  const { userProfile, isLoadingUserProfile } = useUserProfile();

  // Date calculations for statistics
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const startDate = thirtyDaysAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  // API hooks
  const { stats, isLoading: statsLoading } = useUserStatsSummary();
  const { tagStats } = useTagFocusStats(startDate, endDate);
  const { weeklyData } = useWeeklyProgress();
  const { plans } = usePlans({ startDate, endDate });

  // Recent activities from plans
  const allCompletedActivities = useMemo(() => {
    return plans
      .filter((plan) => plan.isCompleted)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [plans]);

  const recentActivities = useMemo(() => {
    return showAllActivities
      ? allCompletedActivities
      : allCompletedActivities.slice(0, 4);
  }, [allCompletedActivities, showAllActivities]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  // Helper functions
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }
    return `${minutes}dk`;
  };

  const formatHours = (seconds: number) => {
    return Math.round((seconds / 3600) * 10) / 10;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Profile Header */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md">
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={user.fullName || user.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold">
                  {user.fullName
                    ? user.fullName[0].toUpperCase()
                    : user.userName[0].toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={() => setPhotoModalOpen(true)}
              className="absolute bottom-0 right-0 w-10 h-10 bg-orange-600 dark:bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {user.fullName || user.userName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {user.email}
                </p>
                <div className="flex items-center justify-center md:justify-start mt-2 space-x-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                    Aktif Üye
                  </span>
                  {isLoadingUserProfile ? (
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
                  ) : (
                    <>
                      <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 text-sm font-medium">
                        <span>👣</span>
                        <span>{userProfile?.totalSteps}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 text-sm font-medium">
                        <span>🪙</span>
                        <span>{userProfile?.stepstones}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(true)}
                className="mt-4 md:mt-0 px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-orange-700 dark:hover:bg-orange-600 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Profili Düzenle
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Toplam Çalışma
            </h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {statsLoading
                ? "-"
                : formatHours(stats?.totalFocusDurationSeconds || 0)}
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">saat</span>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Son 30 günde toplam süre
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Tamamlanan Seans
            </h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {statsLoading ? "-" : stats?.totalCompletedSessions || 0}
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">seans</span>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Başarıyla tamamlandı
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Tamamlanan Todo
            </h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {statsLoading ? "-" : stats?.totalToDosCompletedWithFocus || 0}
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">görev</span>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Odaklanarak tamamlandı
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Günlük Ortalama
            </h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {statsLoading
                ? "-"
                : formatHours(stats?.averageSessionDurationSeconds || 0)}
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              saat/gün
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Ortalama seans süresi
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Başarı Oranı
            </h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {statsLoading
                ? "-"
                : Math.round(stats?.sessionCompletionRate || 0)}
              %
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Seans tamamlama oranı
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Progress Chart */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Haftalık Çalışma Dağılımı
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Son 7 günlük performansınız
                </p>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
              {/* Grid Lines */}
              <div className="absolute inset-x-6 top-6 bottom-16 pointer-events-none">
                <div className="h-full flex flex-col justify-between">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full border-t border-gray-200/60 dark:border-gray-600/40 border-dashed"
                    />
                  ))}
                </div>
              </div>

              {/* Chart Bars */}
              <div className="relative h-40 mb-4">
                <div className="flex items-end justify-between h-full px-2">
                  {weeklyData.map((day, index) => {
                    const maxValue = Math.max(
                      ...weeklyData.map((d) => d.value),
                      1
                    );
                    const heightPercentage = (day.value / maxValue) * 100;
                    const height = Math.max(heightPercentage, 4);
                    const isToday = index === new Date().getDay();

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1 group"
                      >
                        {/* Bar */}
                        <div className="relative mb-1">
                          <div
                            className={`w-8 sm:w-10 rounded-lg transition-all duration-500 ease-out transform group-hover:scale-110 group-hover:-translate-y-1 shadow-lg ${
                              isToday
                                ? "bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400 ring-2 ring-orange-300 dark:ring-orange-600"
                                : "bg-gradient-to-t from-orange-500/80 via-orange-400/80 to-orange-300/80 group-hover:from-orange-600 group-hover:via-orange-500 group-hover:to-orange-400"
                            }`}
                            style={{ height: `${height}px` }}
                          />

                          {/* Value Display */}
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                day.value > 0
                                  ? "opacity-0 group-hover:opacity-100 bg-gray-800 dark:bg-white text-white dark:text-gray-800 shadow-lg"
                                  : "opacity-0"
                              }`}
                            >
                              {day.value} dk
                            </div>
                          </div>
                        </div>

                        {/* Day Label */}
                        <div className="text-center">
                          <span
                            className={`text-xs font-medium transition-colors duration-200 ${
                              isToday
                                ? "text-orange-600 dark:text-orange-400 font-bold"
                                : "text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"
                            }`}
                          >
                            {day.day}
                          </span>
                          {isToday && (
                            <div className="w-1 h-1 bg-orange-500 rounded-full mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200/60 dark:border-gray-600/40">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shadow-sm" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Toplam:{" "}
                      {weeklyData.reduce((acc, day) => acc + day.value, 0)} dk
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-sm" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Ortalama:{" "}
                      {Math.round(
                        weeklyData.reduce((acc, day) => acc + day.value, 0) / 7
                      )}{" "}
                      dk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Son Aktiviteler
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {showAllActivities
                    ? `${allCompletedActivities.length} tamamlanan seans`
                    : "Son 4 çalışma seansınız"}
                </p>
              </div>
              <button
                onClick={() => setShowAllActivities(!showAllActivities)}
                className="px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
              >
                {showAllActivities ? "Daha Az Göster" : "Tümünü Gör"}
              </button>
            </div>

            {/* Activities List */}
            <div
              className={`space-y-3 ${
                showAllActivities ? "max-h-96 overflow-y-auto pr-2" : ""
              }`}
            >
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5"
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Left Color Strip */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                      style={{ backgroundColor: activity.color || "#F97316" }}
                    />

                    {/* Content */}
                    <div className="relative p-4 pl-6 border border-gray-200/60 dark:border-gray-700/60 rounded-xl backdrop-blur-sm">
                      <div className="flex items-start gap-4">
                        {/* Date Column */}
                        <div className="flex flex-col items-center justify-center min-w-[60px] bg-white/70 dark:bg-gray-800/70 rounded-lg p-2 border border-gray-200/50 dark:border-gray-700/50">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {format(new Date(activity.createdAt), "MMM", {
                              locale: tr,
                            })}
                          </div>
                          <div className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-none">
                            {format(new Date(activity.createdAt), "dd")}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(activity.createdAt), "HH:mm")}
                          </div>
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-base truncate">
                              {activity.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 ml-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-medium">
                                {activity.duration} dk
                              </span>
                            </div>
                          </div>

                          {activity.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                              {activity.description}
                            </p>
                          )}

                          {/* Tags and Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {activity.tagName && (
                                <span
                                  className="px-3 py-1 text-white rounded-full text-xs font-medium shadow-sm"
                                  style={{
                                    backgroundColor:
                                      activity.color || "#F97316",
                                  }}
                                >
                                  {activity.tagName}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Tamamlandı
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Henüz aktivite yok
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    İlk çalışma seansınızı tamamlayın ve burada görün
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Favorite Tags */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  En Çok Kullanılan Etiketler
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  En aktif olduğunuz kategoriler
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {tagStats.slice(0, 5).map((tag, index) => (
                <div
                  key={tag.tagId}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1"
                >
                  {/* Gradient Background */}
                  <div
                    className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${tag.tagColor}40, ${tag.tagColor}20)`,
                    }}
                  />

                  {/* Left Border */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 group-hover:w-1.5"
                    style={{ backgroundColor: tag.tagColor }}
                  />

                  {/* Content */}
                  <div className="relative p-4 pl-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {/* Rank Badge */}
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                            style={{ backgroundColor: tag.tagColor }}
                          >
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                            {tag.tagName}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              {formatDuration(tag.totalFocusDurationSeconds)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{tag.totalCompletedSessions} seans</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Progress Indicator */}
                      <div className="flex flex-col items-end gap-2">
                        <div
                          className="text-lg font-bold tracking-tight"
                          style={{ color: tag.tagColor }}
                        >
                          #{index + 1}
                        </div>
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              backgroundColor: tag.tagColor,
                              width: `${Math.min(
                                100,
                                (tag.totalCompletedSessions /
                                  Math.max(
                                    ...tagStats
                                      .slice(0, 5)
                                      .map((t) => t.totalCompletedSessions)
                                  )) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {tagStats.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Henüz etiket kullanımı yok
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Çalışma seanslarınızda etiketler kullanmaya başlayın
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Streak Info */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Çalışma Serisi
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    Mevcut Seri
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats?.currentStreakDays || 0} gün
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3l14 9-14 9V3z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    En Uzun Seri
                  </span>
                </div>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats?.longestStreakDays || 0} gün
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Günde en az 25 dakika çalışma yaparak serinizi sürdürün!
              </p>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && user && (
        <EditProfileModal user={user} onClose={() => setEditModalOpen(false)} />
      )}
      {isPhotoModalOpen && (
        <UploadPhotoModal onClose={() => setPhotoModalOpen(false)} />
      )}
    </div>
  );
};

export default ProfilePage;
