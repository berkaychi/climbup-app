"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import {
  LeaderboardSortCriteria,
  LeaderboardPeriod,
} from "@/lib/leaderboardService";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<LeaderboardSortCriteria>(
    LeaderboardSortCriteria.TotalFocusDuration,
  );
  const [period, setPeriod] = useState<LeaderboardPeriod>(
    LeaderboardPeriod.AllTime,
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
    <div className="max-w-7xl mx-auto" data-oid="b048oh3">
      {/* Header with Mountain Theme */}
      <div
        className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 rounded-2xl p-8 mb-8 overflow-hidden"
        data-oid="d_x6nt_"
      >
        {/* Mountain Background */}
        <div className="absolute inset-0 opacity-20" data-oid="9ik:y86">
          <svg
            viewBox="0 0 400 100"
            className="w-full h-full"
            data-oid="5b2a4gm"
          >
            <polygon
              points="0,100 50,60 120,40 200,25 280,35 350,50 400,60 400,100"
              fill="currentColor"
              className="text-white"
              data-oid="uz9um6-"
            />

            <polygon
              points="0,100 80,70 150,50 250,30 320,45 400,55 400,100"
              fill="currentColor"
              className="text-white opacity-70"
              data-oid="gsicd99"
            />
          </svg>
        </div>

        <div className="relative z-10" data-oid="z80-dw-">
          <div className="flex items-center mb-4" data-oid="37d8bpd">
            <div className="text-4xl mr-4" data-oid="i6g5ud1">
              🏔️
            </div>
            <div data-oid="e22v-1o">
              <h1
                className="text-3xl font-bold text-white mb-2"
                data-oid="4wt0fn:"
              >
                Tırmanış Liderlik Tablosu
              </h1>
              <p className="text-orange-100 text-lg" data-oid="w0nfauy">
                En yüksek zirvelere ulaşan tırmanıcıları keşfedin
              </p>
            </div>
          </div>

          {userPosition && (
            <div
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-6"
              data-oid="m_59e49"
            >
              <div
                className="flex items-center justify-between text-white"
                data-oid="_r3zjme"
              >
                <div className="flex items-center" data-oid="75hmcn5">
                  <span className="text-2xl mr-3" data-oid="d-bi1i2">
                    {service?.getClimbingRankEmoji(userPosition.rank)}
                  </span>
                  <div data-oid="zx_gvfy">
                    <p className="font-semibold" data-oid="7.l-9ud">
                      Sizin Pozisyonunuz
                    </p>
                    <p className="text-sm text-orange-100" data-oid="24huna9">
                      {userPosition.rank}. sırada •{" "}
                      {service?.getClimbingLevel(userPosition.score, sortBy)}
                    </p>
                  </div>
                </div>
                <div className="text-right" data-oid="qh4uw80">
                  <p className="text-2xl font-bold" data-oid="jl2wwmc">
                    {userPosition.formattedScore || userPosition.score}
                  </p>
                  <p className="text-sm text-orange-100" data-oid="358xfou">
                    {getSortDisplayName(sortBy)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6 mb-6"
        data-oid="msivie0"
      >
        <div className="flex flex-col md:flex-row gap-4" data-oid="mvn:7qa">
          <div className="flex-1" data-oid="31_2_t2">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="3:xln3x"
            >
              Sıralama Kriteri
            </label>
            <div className="grid grid-cols-2 gap-2" data-oid="85evo49">
              <button
                onClick={() =>
                  setSortBy(LeaderboardSortCriteria.TotalFocusDuration)
                }
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  sortBy === LeaderboardSortCriteria.TotalFocusDuration
                    ? "bg-orange-600 dark:bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                }`}
                data-oid="7u42139"
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
                data-oid="mhu873f"
              >
                ✅ Tamamlanan Seans
              </button>
            </div>
          </div>

          <div className="flex-1" data-oid="d1acna1">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              data-oid="mtx.-w."
            >
              Zaman Dilimi
            </label>
            <div className="grid grid-cols-3 gap-2" data-oid="-rr_bk.">
              {Object.values(LeaderboardPeriod).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    period === p
                      ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  }`}
                  data-oid="u9lsnl_"
                >
                  {getPeriodDisplayName(p)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6"
        data-oid="2_ga:gs"
      >
        <div
          className="flex items-center justify-between mb-6"
          data-oid="..dfb2f"
        >
          <h2
            className="text-xl font-bold text-gray-800 dark:text-gray-100"
            data-oid="bjwypbd"
          >
            🏆 {getPeriodDisplayName(period)} - {getSortDisplayName(sortBy)}
          </h2>
          {leaderboard && (
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              data-oid="im._ptx"
            >
              Toplam {leaderboard.totalEntries} tırmanıcı
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4" data-oid="6slp6qk">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse" data-oid="18ab8zt">
                <div
                  className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  data-oid="0hkarra"
                >
                  <div
                    className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"
                    data-oid="5kvesc7"
                  ></div>
                  <div className="flex-1" data-oid="qb20af_">
                    <div
                      className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"
                      data-oid="vf:uw32"
                    ></div>
                    <div
                      className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"
                      data-oid="rldr-5a"
                    ></div>
                  </div>
                  <div
                    className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"
                    data-oid="uorg25_"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : leaderboard?.entries.length ? (
          <div className="space-y-3" data-oid="2tn3_qs">
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
                data-oid="b3avuyq"
              >
                {/* Rank Badge */}
                <div
                  className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-orange-600 dark:bg-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-lg"
                  data-oid="r23-k99"
                >
                  {entry.rank}
                </div>

                <div className="flex items-center" data-oid="dyljd5:">
                  {/* Rank Emoji */}
                  <div className="text-3xl mr-4" data-oid="w2fsvcf">
                    {service?.getClimbingRankEmoji(entry.rank)}
                  </div>

                  {/* Profile Picture */}
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white dark:border-gray-600 shadow-md"
                    data-oid="i046ksm"
                  >
                    {entry.profilePictureUrl ? (
                      <img
                        src={entry.profilePictureUrl}
                        alt={entry.fullName}
                        className="w-full h-full object-cover"
                        data-oid="njg:8rr"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg"
                        data-oid="pv:.qed"
                      >
                        {entry.fullName[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1" data-oid="b4iyvk-">
                    <h3
                      className="font-semibold text-gray-800 dark:text-gray-100 text-lg"
                      data-oid="31rc5qb"
                    >
                      {entry.fullName}
                      {entry.userId === user?.id && (
                        <span
                          className="ml-2 text-xs bg-orange-600 dark:bg-orange-500 text-white px-2 py-1 rounded-full"
                          data-oid="kb.3-ac"
                        >
                          SİZ
                        </span>
                      )}
                    </h3>
                    <p
                      className="text-sm text-gray-600 dark:text-gray-400"
                      data-oid="wry_ij3"
                    >
                      {service?.getClimbingLevel(entry.score, sortBy)}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right" data-oid="o7l::74">
                    <p
                      className="text-2xl font-bold text-gray-800 dark:text-gray-100"
                      data-oid="9wl11e3"
                    >
                      {entry.formattedScore || entry.score}
                    </p>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                      data-oid="we5fny6"
                    >
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
          <div className="text-center py-12" data-oid="fkgl_ss">
            <div className="text-6xl mb-4" data-oid="hun2edx">
              🏔️
            </div>
            <p
              className="text-gray-500 dark:text-gray-400 text-lg"
              data-oid="j654w6i"
            >
              Henüz tırmanıcı bulunmuyor. İlk olmaya ne dersiniz?
            </p>
          </div>
        )}

        {/* Pagination */}
        {leaderboard && leaderboard.totalPages > 1 && (
          <div
            className="flex justify-center items-center space-x-2 mt-8"
            data-oid="_v1u2hg"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              data-oid="7m7_c1w"
            >
              ← Önceki
            </button>

            <div className="flex space-x-1" data-oid="tm_3v7n">
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
                      data-oid="x-g3q15"
                    >
                      {page}
                    </button>
                  );
                },
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === leaderboard.totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              data-oid="-j1pgr."
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
