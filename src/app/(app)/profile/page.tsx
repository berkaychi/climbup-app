"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
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
import DeleteAccountModal from "@/components/DeleteAccountModal";

const ProfilePage = () => {
  const { user, isLoading, getAccessToken } = useAuth();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deletionStatusMessage, setDeletionStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const { resolvedTheme } = useTheme();
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
  const recentActivities = useMemo(() => {
    return plans
      .filter((plan) => plan.isCompleted)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 4);
  }, [plans]);

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

  const handleInitiateAccountDeletion = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    setDeletionStatusMessage(null);
    const token = getAccessToken();

    if (!token) {
      setDeletionStatusMessage({
        text: "Kimlik doğrulama tokenı bulunamadı. Lütfen tekrar giriş yapın.",
        type: "error",
      });
      setIsDeletingAccount(false);
      setDeleteModalOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/initiate-deletion`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDeleteModalOpen(false);

      if (response.ok) {
        const data = await response.json();
        setDeletionStatusMessage({
          text:
            data.message ||
            "Hesap silme onay e-postası adresinize gönderildi. Lütfen e-postanızı kontrol edin.",
          type: "success",
        });
      } else {
        const errorData = await response.json().catch(() => ({
          message:
            "Hesap silme işlemi başlatılamadı. Lütfen daha sonra tekrar deneyin.",
        }));
        console.error("Error initiating account deletion:", errorData);
        setDeletionStatusMessage({
          text:
            errorData.message || `Bir hata oluştu (Kod: ${response.status}).`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error initiating account deletion:", error);
      setDeleteModalOpen(false);
      setDeletionStatusMessage({
        text: "Ağ hatası veya beklenmedik bir sorun oluştu. Lütfen internet bağlantınızı kontrol edin.",
        type: "error",
      });
    } finally {
      setIsDeletingAccount(false);
    }
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Haftalık Çalışma Dağılımı
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Bu hafta</span>
              </div>
            </div>
            <div className="flex items-end justify-between h-32 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
              {weeklyData.map((day, index) => {
                const maxValue = Math.max(...weeklyData.map((d) => d.value), 1);
                const height = Math.max((day.value / maxValue) * 100, 4);

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="w-6 bg-gradient-to-t from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500 rounded-t transition-all duration-300 hover:from-orange-600 hover:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-400 shadow-sm relative group"
                      style={{ height: `${height}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.value} dk
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Son Aktiviteler
              </h3>
              <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline">
                Tümünü Gör
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {format(new Date(activity.createdAt), "dd MMM", {
                          locale: tr,
                        })}
                      </div>
                      {index < recentActivities.length - 1 && (
                        <div className="w-px h-full bg-gray-200 dark:bg-gray-600 my-1"></div>
                      )}
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500 dark:border-orange-400 rounded-r-lg p-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-800 dark:text-gray-100">
                          {activity.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(activity.createdAt), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {activity.description || "Açıklama yok"} •{" "}
                        {activity.duration} dakika
                      </p>
                      <div className="flex items-center mt-2">
                        {activity.tagName && (
                          <div
                            className="px-2 py-0.5 text-white rounded-full text-xs font-medium mr-2"
                            style={{
                              backgroundColor: activity.color || "#F97316",
                            }}
                          >
                            {activity.tagName}
                          </div>
                        )}
                        <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                          <svg
                            className="w-3 h-3 mr-1"
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Henüz tamamlanmış aktivite bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Favorite Tags */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              En Çok Kullanılan Etiketler
            </h3>
            <div className="space-y-4">
              {tagStats.slice(0, 5).map((tag) => (
                <div key={tag.tagId} className="flex items-stretch">
                  <div
                    className="w-2 h-full rounded-l-md"
                    style={{ backgroundColor: tag.tagColor }}
                  ></div>
                  <div
                    className="flex-1 flex justify-between items-center rounded-r-md p-3"
                    style={{
                      backgroundColor: `${tag.tagColor}${
                        resolvedTheme === "dark" ? "40" : "20"
                      }`,
                    }}
                  >
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {tag.tagName}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDuration(tag.totalFocusDurationSeconds)} çalışma
                      </div>
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: tag.tagColor }}
                    >
                      {tag.totalCompletedSessions} seans
                    </div>
                  </div>
                </div>
              ))}
              {tagStats.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Henüz etiket kullanımı bulunmuyor.</p>
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

      {/* Danger Zone - Account Deletion */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto bg-red-50/50 dark:bg-gray-800/30 p-6 rounded-xl shadow-md border border-red-200 dark:border-red-500/30">
          <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-3">
            Tehlikeli Alan
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Hesabınızı silmek, tüm verilerinizin (planlar, istatistikler,
            ayarlar vb.) kalıcı olarak kaybolmasına neden olur. Bu işlem geri
            alınamaz.
          </p>

          {deletionStatusMessage && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                deletionStatusMessage.type === "success"
                  ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/50"
                  : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/50"
              }`}
            >
              {deletionStatusMessage.text}
            </div>
          )}

          <button
            onClick={() => {
              setDeletionStatusMessage(null);
              setDeleteModalOpen(true);
            }}
            disabled={isDeletingAccount}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center"
          >
            {isDeletingAccount && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            )}
            Hesabımı Silme İşlemini Başlat
          </button>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Bu butona tıkladığınızda, hesap silme işlemini onaylamanız için
            e-posta adresinize bir bağlantı gönderilecektir.
          </p>
        </div>
      </div>

      {isEditModalOpen && user && (
        <EditProfileModal user={user} onClose={() => setEditModalOpen(false)} />
      )}
      {isPhotoModalOpen && (
        <UploadPhotoModal onClose={() => setPhotoModalOpen(false)} />
      )}
      {isDeleteModalOpen && (
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            if (!isDeletingAccount) {
              setDeleteModalOpen(false);
            }
          }}
          onConfirm={handleInitiateAccountDeletion}
          isLoading={isDeletingAccount}
        />
      )}
    </div>
  );
};

export default ProfilePage;
