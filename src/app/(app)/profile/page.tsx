"use client";

import { useEffect, useMemo } from "react";
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

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

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
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
      <div
        className="flex justify-center items-center min-h-[calc(100vh-200px)]"
        data-oid="ac:cyhw"
      >
        <div className="text-center" data-oid="23c4nfq">
          <div
            className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            data-oid="xbr1emk"
          ></div>
          <p
            className="text-xl text-gray-500 dark:text-gray-400"
            data-oid="jeh1099"
          >
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
    <div className="max-w-7xl mx-auto" data-oid="ncktf-j">
      {/* Profile Header */}
      <div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6 mb-6"
        data-oid="8e.m4ow"
      >
        <div
          className="flex flex-col md:flex-row items-center md:items-start"
          data-oid="-yo3q0r"
        >
          <div className="relative mb-4 md:mb-0 md:mr-6" data-oid="hw62y2s">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md"
              data-oid="47s4g.8"
            >
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={user.fullName || user.userName}
                  className="w-full h-full object-cover"
                  data-oid="a9:wd45"
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold"
                  data-oid="5jgp3ol"
                >
                  {user.fullName
                    ? user.fullName[0].toUpperCase()
                    : user.userName[0].toUpperCase()}
                </div>
              )}
            </div>
            <button
              className="absolute bottom-0 right-0 w-10 h-10 bg-orange-600 dark:bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
              data-oid="-cgq-4k"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="rcl9aqw"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  data-oid="ffc8goq"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  data-oid="t025vke"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left" data-oid="evdnl9w">
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between"
              data-oid="2n24.-9"
            >
              <div data-oid="z13u2f7">
                <h1
                  className="text-2xl font-bold text-gray-800 dark:text-gray-100"
                  data-oid="74w:lzy"
                >
                  {user.fullName || user.userName}
                </h1>
                <p
                  className="text-gray-600 dark:text-gray-400 mt-1"
                  data-oid="62m-2k0"
                >
                  {user.email}
                </p>
                <div
                  className="flex items-center justify-center md:justify-start mt-2 space-x-2"
                  data-oid="h9kd4b9"
                >
                  <span
                    className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full"
                    data-oid="0gh1i58"
                  >
                    Aktif Üye
                  </span>
                </div>
              </div>
              <button
                className="mt-4 md:mt-0 px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-orange-700 dark:hover:bg-orange-600 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                data-oid="ln.1d5s"
              >
                <div className="flex items-center" data-oid="06wolls">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="5ub60ik"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      data-oid="d7ufkzg"
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
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6"
        data-oid="mt26lu1"
      >
        <div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          data-oid="a1wd1ql"
        >
          <div className="flex items-center mb-2" data-oid="1itt0ol">
            <div
              className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3"
              data-oid=".ft69-e"
            >
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="zmip0l8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  data-oid="bz1f441"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold text-gray-700 dark:text-gray-200"
              data-oid="ju7szx."
            >
              Toplam Çalışma
            </h3>
          </div>
          <div className="flex items-end" data-oid="iiwlngc">
            <span
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
              data-oid="f5tq1lg"
            >
              {statsLoading
                ? "-"
                : formatHours(stats?.totalFocusDurationSeconds || 0)}
            </span>
            <span
              className="ml-2 text-gray-600 dark:text-gray-400"
              data-oid="xrzs5gj"
            >
              saat
            </span>
          </div>
          <div
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            data-oid="xpp8kab"
          >
            Son 30 günde toplam süre
          </div>
        </div>

        <div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          data-oid="-_4o75w"
        >
          <div className="flex items-center mb-2" data-oid="enk6qc1">
            <div
              className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3"
              data-oid="ijmo232"
            >
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="gx.si.y"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  data-oid="2n467sf"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold text-gray-700 dark:text-gray-200"
              data-oid="jecq_mv"
            >
              Tamamlanan Seans
            </h3>
          </div>
          <div className="flex items-end" data-oid="zhvqo1d">
            <span
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
              data-oid="1s:mka2"
            >
              {statsLoading ? "-" : stats?.totalCompletedSessions || 0}
            </span>
            <span
              className="ml-2 text-gray-600 dark:text-gray-400"
              data-oid="vh7kc15"
            >
              seans
            </span>
          </div>
          <div
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            data-oid="w58:-f-"
          >
            Başarıyla tamamlandı
          </div>
        </div>

        <div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          data-oid="sxhvuxy"
        >
          <div className="flex items-center mb-2" data-oid="1r.anq:">
            <div
              className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3"
              data-oid="s14r6rd"
            >
              <svg
                className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="j67fess"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  data-oid="vbzl1ea"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold text-gray-700 dark:text-gray-200"
              data-oid="qrzn1n_"
            >
              Tamamlanan Todo
            </h3>
          </div>
          <div className="flex items-end" data-oid="dsym.6.">
            <span
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
              data-oid="ytaa8y7"
            >
              {statsLoading ? "-" : stats?.totalToDosCompletedWithFocus || 0}
            </span>
            <span
              className="ml-2 text-gray-600 dark:text-gray-400"
              data-oid="9gs1u16"
            >
              görev
            </span>
          </div>
          <div
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            data-oid="d6rehbi"
          >
            Odaklanarak tamamlandı
          </div>
        </div>

        <div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          data-oid=":hpb-e0"
        >
          <div className="flex items-center mb-2" data-oid="e.v3p.y">
            <div
              className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3"
              data-oid="xeu5rqf"
            >
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="ymeq7h4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  data-oid="51wcjbx"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold text-gray-700 dark:text-gray-200"
              data-oid="cebpv9m"
            >
              Günlük Ortalama
            </h3>
          </div>
          <div className="flex items-end" data-oid="qu50qe7">
            <span
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
              data-oid="_ipt8pm"
            >
              {statsLoading
                ? "-"
                : formatHours(stats?.averageSessionDurationSeconds || 0)}
            </span>
            <span
              className="ml-2 text-gray-600 dark:text-gray-400"
              data-oid=".3e3f2n"
            >
              saat/gün
            </span>
          </div>
          <div
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            data-oid="a-drcy2"
          >
            Ortalama seans süresi
          </div>
        </div>

        <div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          data-oid="f0.sfyu"
        >
          <div className="flex items-center mb-2" data-oid="dr-rnod">
            <div
              className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3"
              data-oid="vgtt5ff"
            >
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="c-9287o"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  data-oid="4kv23ku"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold text-gray-700 dark:text-gray-200"
              data-oid="i4agj5."
            >
              Başarı Oranı
            </h3>
          </div>
          <div className="flex items-end" data-oid="o.m-su5">
            <span
              className="text-3xl font-bold text-gray-800 dark:text-gray-100"
              data-oid="qo3y6jv"
            >
              {statsLoading
                ? "-"
                : Math.round(stats?.sessionCompletionRate || 0)}
              %
            </span>
          </div>
          <div
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            data-oid="hnr5wqn"
          >
            Seans tamamlama oranı
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-oid="ddppi8c">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6" data-oid="tngfseh">
          {/* Weekly Progress Chart */}
          <div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6"
            data-oid="okdl8q6"
          >
            <div
              className="flex justify-between items-center mb-4"
              data-oid="x013tvm"
            >
              <h3
                className="text-lg font-semibold text-gray-700 dark:text-gray-200"
                data-oid="j74j95m"
              >
                Haftalık Çalışma Dağılımı
              </h3>
              <div
                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                data-oid="20vlnj8"
              >
                <span data-oid="w0r_c7f">Bu hafta</span>
              </div>
            </div>
            <div
              className="flex items-end justify-between h-32 mb-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2"
              data-oid="0_86.9k"
            >
              {weeklyData.map((day, index) => {
                const maxValue = Math.max(...weeklyData.map((d) => d.value), 1);
                const height = Math.max((day.value / maxValue) * 100, 4);

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                    data-oid="y4h0qc7"
                  >
                    <div
                      className="w-6 bg-gradient-to-t from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500 rounded-t transition-all duration-300 hover:from-orange-600 hover:to-orange-500 dark:hover:from-orange-500 dark:hover:to-orange-400 shadow-sm relative group"
                      style={{ height: `${height}px` }}
                      data-oid="c3r0:7p"
                    >
                      <div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        data-oid="4sdn5za"
                      >
                        {day.value} dk
                      </div>
                    </div>
                    <span
                      className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium"
                      data-oid="rbcu0hg"
                    >
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6"
            data-oid="7qetq33"
          >
            <div
              className="flex justify-between items-center mb-4"
              data-oid=":e30.-x"
            >
              <h3
                className="text-lg font-semibold text-gray-700 dark:text-gray-200"
                data-oid="a99fms2"
              >
                Son Aktiviteler
              </h3>
              <button
                className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline"
                data-oid="ng87mtn"
              >
                Tümünü Gör
              </button>
            </div>
            <div className="space-y-4" data-oid="2wcwy8n">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex" data-oid="aqiut2g">
                    <div
                      className="flex flex-col items-center mr-4"
                      data-oid="xr.th0i"
                    >
                      <div
                        className="text-sm font-medium text-gray-500 dark:text-gray-400"
                        data-oid="8cgjw_4"
                      >
                        {format(new Date(activity.createdAt), "dd MMM", {
                          locale: tr,
                        })}
                      </div>
                      {index < recentActivities.length - 1 && (
                        <div
                          className="w-px h-full bg-gray-200 dark:bg-gray-600 my-1"
                          data-oid="oqjhxjv"
                        ></div>
                      )}
                    </div>
                    <div
                      className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500 dark:border-orange-400 rounded-r-lg p-3 flex-1"
                      data-oid="8y_gi:s"
                    >
                      <div
                        className="flex justify-between items-start"
                        data-oid="9ifu5o2"
                      >
                        <h4
                          className="font-medium text-gray-800 dark:text-gray-100"
                          data-oid="9csybv6"
                        >
                          {activity.title}
                        </h4>
                        <span
                          className="text-xs text-gray-500 dark:text-gray-400"
                          data-oid="hnn9692"
                        >
                          {format(new Date(activity.createdAt), "HH:mm")}
                        </span>
                      </div>
                      <p
                        className="text-sm text-gray-600 dark:text-gray-300 mt-1"
                        data-oid="25_nhzp"
                      >
                        {activity.description || "Açıklama yok"} •{" "}
                        {activity.duration} dakika
                      </p>
                      <div
                        className="flex items-center mt-2"
                        data-oid=":0p0lrn"
                      >
                        {activity.tagName && (
                          <div
                            className="px-2 py-0.5 text-white rounded-full text-xs font-medium mr-2"
                            style={{
                              backgroundColor: activity.color || "#F97316",
                            }}
                            data-oid="yi:u637"
                          >
                            {activity.tagName}
                          </div>
                        )}
                        <div
                          className="flex items-center text-green-600 dark:text-green-400 text-xs"
                          data-oid="h7h:sx5"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="kuon54b"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                              data-oid="xt:976y"
                            />
                          </svg>
                          Tamamlandı
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                  data-oid="t7slzps"
                >
                  <p data-oid="y57yed9">
                    Henüz tamamlanmış aktivite bulunmuyor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6" data-oid="covzvsm">
          {/* Favorite Tags */}
          <div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6"
            data-oid="l4q3--w"
          >
            <h3
              className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4"
              data-oid="wf2a-zz"
            >
              En Çok Kullanılan Etiketler
            </h3>
            <div className="space-y-4" data-oid="-azp_6v">
              {tagStats.slice(0, 5).map((tag) => (
                <div
                  key={tag.tagId}
                  className="flex items-stretch"
                  data-oid="lx_fusj"
                >
                  <div
                    className="w-2 h-full rounded-l-md"
                    style={{ backgroundColor: tag.tagColor }}
                    data-oid="d79vi2c"
                  ></div>
                  <div
                    className="flex-1 flex justify-between items-center rounded-r-md p-3"
                    style={{
                      backgroundColor: `${tag.tagColor}${
                        resolvedTheme === "dark" ? "40" : "20"
                      }`,
                    }}
                    data-oid="ty8esrq"
                  >
                    <div data-oid="2qfeb8u">
                      <span
                        className="font-medium text-gray-800 dark:text-gray-100"
                        data-oid="dyzrwhc"
                      >
                        {tag.tagName}
                      </span>
                      <div
                        className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        data-oid="yn6v9t0"
                      >
                        {formatDuration(tag.totalFocusDurationSeconds)} çalışma
                      </div>
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: tag.tagColor }}
                      data-oid="810t4nq"
                    >
                      {tag.totalCompletedSessions} seans
                    </div>
                  </div>
                </div>
              ))}
              {tagStats.length === 0 && (
                <div
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                  data-oid="29s:5al"
                >
                  <p data-oid="mcoor1j">Henüz etiket kullanımı bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>

          {/* Streak Info */}
          <div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6"
            data-oid="u_n04tu"
          >
            <h3
              className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4"
              data-oid="grjsw2z"
            >
              Çalışma Serisi
            </h3>
            <div className="space-y-4" data-oid="oclvvj:">
              <div
                className="flex items-center justify-between"
                data-oid="kl.aoub"
              >
                <div className="flex items-center" data-oid="ag20hh:">
                  <div
                    className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3"
                    data-oid="rrnzj28"
                  >
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="02lut44"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                        data-oid="brgj71_"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-gray-700 dark:text-gray-200"
                    data-oid="dbm5e:b"
                  >
                    Mevcut Seri
                  </span>
                </div>
                <span
                  className="text-2xl font-bold text-green-600 dark:text-green-400"
                  data-oid="qsorfn3"
                >
                  {stats?.currentStreakDays || 0} gün
                </span>
              </div>

              <div
                className="flex items-center justify-between"
                data-oid="q4c9xna"
              >
                <div className="flex items-center" data-oid="jaos213">
                  <div
                    className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3"
                    data-oid="hzv3k2p"
                  >
                    <svg
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="5yuqf-a"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3l14 9-14 9V3z"
                        data-oid=".jzkldk"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-gray-700 dark:text-gray-200"
                    data-oid="4hasp-w"
                  >
                    En Uzun Seri
                  </span>
                </div>
                <span
                  className="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                  data-oid="lgqu4_4"
                >
                  {stats?.longestStreakDays || 0} gün
                </span>
              </div>
            </div>
            <div
              className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              data-oid="jm7z1y_"
            >
              <p
                className="text-sm text-blue-700 dark:text-blue-300"
                data-oid="ud:hz5o"
              >
                💡 Günde en az 25 dakika çalışma yaparak serinizi sürdürün!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
