"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/stores/authStore";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import {
  LeaderboardSortCriteria,
  LeaderboardPeriod,
} from "@/lib/leaderboardService";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<LeaderboardSortCriteria>(
    LeaderboardSortCriteria.TotalFocusDuration
  );
  const [period, setPeriod] = useState<LeaderboardPeriod>(
    LeaderboardPeriod.AllTime
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { leaderboard, isLoading, service } = useLeaderboard({
    sortBy,
    period,
    limit: 20,
    page: currentPage,
  });

  // Find current user's position
  const userPosition = useMemo(() => {
    if (!leaderboard?.entries || !user) return null;
    return leaderboard.entries.find((entry) => entry.userId === user.id);
  }, [leaderboard, user]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPeriodDisplayName = (p: LeaderboardPeriod) => {
    switch (p) {
      case LeaderboardPeriod.AllTime:
        return "Tüm Zamanlar";
      case LeaderboardPeriod.CurrentWeek:
        return "Bu Hafta";
      case LeaderboardPeriod.CurrentMonth:
        return "Bu Ay";
      default:
        return "Tüm Zamanlar";
    }
  };

  const getSortDisplayName = (s: LeaderboardSortCriteria) => {
    switch (s) {
      case LeaderboardSortCriteria.TotalFocusDuration:
        return "Çalışma Süresi";
      case LeaderboardSortCriteria.TotalCompletedSessions:
        return "Tamamlanan Seans";
      default:
        return "Çalışma Süresi";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Mountain Theme */}
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 rounded-2xl p-8 mb-8 overflow-hidden">
        {/* Mountain Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 100" className="w-full h-full">
            <polygon
              points="0,100 50,60 120,40 200,25 280,35 350,50 400,60 400,100"
              fill="currentColor"
              className="text-white"
            />

            <polygon
              points="0,100 80,70 150,50 250,30 320,45 400,55 400,100"
              fill="currentColor"
              className="text-white opacity-70"
            />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">🏔️</div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Tırmanış Liderlik Tablosu
              </h1>
              <p className="text-orange-100 text-lg">
                En yüksek zirvelere ulaşan tırmanıcıları keşfedin
              </p>
            </div>
          </div>

          {userPosition && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {service?.getClimbingRankEmoji(userPosition.rank)}
                  </span>
                  <div>
                    <p className="font-semibold">Sizin Pozisyonunuz</p>
                    <p className="text-sm text-orange-100">
                      {userPosition.rank}. sırada •{" "}
                      {service?.getClimbingLevel(userPosition.score, sortBy)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {userPosition.formattedScore || userPosition.score}
                  </p>
                  <p className="text-sm text-orange-100">
                    {getSortDisplayName(sortBy)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sıralama Kriteri
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  setSortBy(LeaderboardSortCriteria.TotalFocusDuration)
                }
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  sortBy === LeaderboardSortCriteria.TotalFocusDuration
                    ? "bg-orange-600 dark:bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                }`}
              >
                ⏱️ Çalışma Süresi
              </button>
              <button
                onClick={() =>
                  setSortBy(LeaderboardSortCriteria.TotalCompletedSessions)
                }
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  sortBy === LeaderboardSortCriteria.TotalCompletedSessions
                    ? "bg-orange-600 dark:bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                }`}
              >
                ✅ Tamamlanan Seans
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zaman Dilimi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(LeaderboardPeriod).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    period === p
                      ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  }`}
                >
                  {getPeriodDisplayName(p)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            🏆 {getPeriodDisplayName(period)} - {getSortDisplayName(sortBy)}
          </h2>
          {leaderboard && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toplam {leaderboard.totalEntries} tırmanıcı
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : leaderboard?.entries.length ? (
          <div className="space-y-3">
            {leaderboard.entries.map((entry) => (
              <div
                key={entry.userId}
                className={`relative p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  entry.userId === user?.id
                    ? "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-300 dark:border-orange-600"
                    : entry.rank <= 3
                    ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700"
                    : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {/* Rank Badge */}
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-orange-600 dark:bg-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                  {entry.rank}
                </div>

                <div className="flex items-center">
                  {/* Rank Emoji */}
                  <div className="text-3xl mr-4">
                    {service?.getClimbingRankEmoji(entry.rank)}
                  </div>

                  {/* Profile Picture */}
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white dark:border-gray-600 shadow-md">
                    {entry.profilePictureUrl ? (
                      <img
                        src={entry.profilePictureUrl}
                        alt={entry.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                        {entry.fullName[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                      {entry.fullName}
                      {entry.userId === user?.id && (
                        <span className="ml-2 text-xs bg-orange-600 dark:bg-orange-500 text-white px-2 py-1 rounded-full">
                          SİZ
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {service?.getClimbingLevel(entry.score, sortBy)}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {entry.formattedScore || entry.score}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sortBy === LeaderboardSortCriteria.TotalFocusDuration
                        ? "çalışma"
                        : "seans"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏔️</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Henüz tırmanıcı bulunmuyor. İlk olmaya ne dersiniz?
            </p>
          </div>
        )}

        {/* Pagination */}
        {leaderboard && leaderboard.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← Önceki
            </button>

            <div className="flex space-x-1">
              {Array.from(
                { length: Math.min(5, leaderboard.totalPages) },
                (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-orange-600 dark:bg-orange-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === leaderboard.totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Sonraki →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
