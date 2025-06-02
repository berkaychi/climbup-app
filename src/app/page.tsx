"use client"; // İstemci tarafı etkileşimleri için

import Link from "next/link";

const HomePage = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      data-oid=".pwub_h"
    >
      {/* Hero Section with v4.1 features */}
      <section className="relative overflow-hidden" data-oid="v5yclbl">
        {/* v4.1 NEW: Enhanced gradient backgrounds with modern interpolation */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none z-0"
          data-oid="cr-2lg7"
        >
          {/* Büyük Gradient Orb - Sol Üst using enhanced gradients */}
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 bg-gradient-to-br from-orange-300 to-pink-400 blur-3xl"
            data-oid="y_-x9lk"
          ></div>

          {/* Orta Gradient Orb - Sağ Ortada */}
          <div
            className="absolute top-1/3 -right-16 w-80 h-80 rounded-full opacity-8 bg-gradient-to-l from-blue-300 to-teal-400 blur-2xl"
            data-oid="ibx5icl"
          ></div>

          {/* Küçük Gradient Orb - Sol Alt */}
          <div
            className="absolute -bottom-12 left-1/4 w-64 h-64 rounded-full opacity-10 bg-gradient-to-tr from-emerald-300 to-cyan-400 blur-xl"
            data-oid="-cnz:pt"
          ></div>
        </div>

        <div
          className="relative z-10 px-6 py-20 text-center max-w-5xl mx-auto"
          data-oid="b09.0zp"
        >
          {/* v4.1 NEW: Text shadows for better visibility */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold font-pacifico mb-6 text-shadow-lg"
            data-oid="ncu.hgr"
          >
            <span
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 bg-clip-text text-transparent"
              data-oid="n-8krsy"
            >
              ClimbUp
            </span>
          </h1>

          {/* v4.1 NEW: Enhanced typography with text-wrap */}
          <p
            className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-8 font-medium leading-relaxed max-w-3xl mx-auto"
            data-oid="d5kkup_"
          >
            Odaklanma sürenizi artırın, hedeflerinize ulaşın.{" "}
            <span
              className="font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
              data-oid="es83_wc"
            >
              Modern ve etkili
            </span>{" "}
            pomodoro tekniği ile verimliliğinizi maksimize edin.
          </p>

          {/* v4.1 NEW: Pointer-aware button sizing */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            data-oid="xzuhtkb"
          >
            <Link
              href="/home"
              className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl font-semibold text-base md:text-lg shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 z-20 relative"
              data-oid="clw0uam"
            >
              <span
                className="flex items-center justify-center gap-2"
                data-oid="y:d-8_o"
              >
                🎯 Odaklanmaya Başla
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="c-pwd3y"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    data-oid="1ttltzo"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* v4.1 NEW: Container query aware stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto relative z-10"
            data-oid="dif_f6o"
          >
            {/* İstatistik Kartları with enhanced shadows */}
            <div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              data-oid="4.l63s."
            >
              <div className="text-3xl lg:text-4xl mb-4" data-oid="ypu6d5t">
                ⏰
              </div>
              <h3
                className="text-lg lg:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2"
                data-oid="z7wcejm"
              >
                Akıllı Zamanlayıcı
              </h3>
              <p
                className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
                data-oid="oyb9hn0"
              >
                25 dakika odaklanma, 5 dakika mola. Bilimsel olarak kanıtlanmış
                pomodoro tekniği.
              </p>
            </div>

            <div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              data-oid="qdqcfah"
            >
              <div className="text-3xl lg:text-4xl mb-4" data-oid="bj7074-">
                📈
              </div>
              <h3
                className="text-lg lg:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2"
                data-oid="9if.yqt"
              >
                İlerleme Takibi
              </h3>
              <p
                className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
                data-oid="13:.6:v"
              >
                Günlük, haftalık ve aylık istatistiklerinizi görün.
                Hedeflerinize ne kadar yakın olduğunuzu bilin.
              </p>
            </div>

            <div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              data-oid="wt54z1d"
            >
              <div className="text-3xl lg:text-4xl mb-4" data-oid="e6ilsx2">
                🎨
              </div>
              <h3
                className="text-lg lg:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2"
                data-oid="rmbhlnl"
              >
                Kişiselleştirme
              </h3>
              <p
                className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
                data-oid="uav6y7r"
              >
                Kendi çalışma tarzınıza uygun zamanlayıcı ayarları. Kısa
                molalar, uzun molalar, hedef belirleme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* v4.1 NEW: Features section with enhanced visual effects */}
      <section
        className="relative py-20 px-6 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 z-10"
        data-oid="w6:vka0"
      >
        <div className="max-w-6xl mx-auto relative z-10" data-oid="q8z7ih5">
          {/* v4.1 NEW: Text with better visual hierarchy */}
          <div className="text-center mb-16" data-oid="-cfp0i9">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6"
              data-oid="00-qnn3"
            >
              Neden ClimbUp?
            </h2>
            <p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              data-oid="a7k_tq."
            >
              Modern teknoloji ile geleneksel pomodoro tekniğini
              birleştiriyoruz. Odaklanma sürenizi artırmak ve hedeflerinize
              ulaşmak hiç bu kadar kolay olmamıştı.
            </p>
          </div>

          {/* v4.1 NEW: Enhanced feature grid with container queries */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            data-oid="3le1f6t"
          >
            {/* Özellik 1 */}
            <div
              className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-3xl p-6 lg:p-8 border border-orange-100 dark:border-orange-800/50 relative z-10"
              data-oid="mzwglng"
            >
              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl mb-6 shadow-lg"
                data-oid="-08k81p"
              >
                🎯
              </div>
              <h3
                className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4"
                data-oid="i59q.47"
              >
                Odaklanma Gücü
              </h3>
              <p
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm lg:text-base"
                data-oid="0ta0ee3"
              >
                Bilimsel araştırmalara dayalı 25 dakikalık odaklanma blokları
                ile dikkatinizi artırın. Beyninizin doğal çalışma ritmiyle
                uyumlu bir sistem.
              </p>
              <ul
                className="space-y-2 text-gray-600 dark:text-gray-400 text-sm lg:text-base"
                data-oid="-qe:kag"
              >
                <li className="flex items-center gap-2" data-oid=".o515wy">
                  <span
                    className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"
                    data-oid="v86a-an"
                  ></span>
                  25 dakika kesintisiz odaklanma
                </li>
                <li className="flex items-center gap-2" data-oid="fe-7050">
                  <span
                    className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"
                    data-oid="-fb_lax"
                  ></span>
                  5 dakika aktif mola
                </li>
                <li className="flex items-center gap-2" data-oid="m.muf6x">
                  <span
                    className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"
                    data-oid="_6l1dy5"
                  ></span>
                  15 dakika uzun mola (4 pomodoro sonrası)
                </li>
              </ul>
            </div>

            {/* Özellik 2 */}
            <div
              className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-3xl p-6 lg:p-8 border border-blue-100 dark:border-blue-800/50 relative z-10"
              data-oid="zo1vpiu"
            >
              <div
                className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl mb-6 shadow-lg"
                data-oid="zk:nqru"
              >
                📊
              </div>
              <h3
                className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4"
                data-oid="o2nkpnf"
              >
                Detaylı Analitik
              </h3>
              <p
                className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm lg:text-base"
                data-oid="7jhj5zz"
              >
                İlerlemenizi takip edin, güçlü yönlerinizi keşfedin ve gelişim
                alanlarınızı belirleyin. Veriye dayalı içgörüler ile
                verimliliğinizi optimize edin.
              </p>
              <ul
                className="space-y-2 text-gray-600 dark:text-gray-400 text-sm lg:text-base"
                data-oid="ioj8bzk"
              >
                <li className="flex items-center gap-2" data-oid="j5uu6k6">
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"
                    data-oid="zu44opt"
                  ></span>
                  Günlük odaklanma süresi
                </li>
                <li className="flex items-center gap-2" data-oid="dfvzp9s">
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"
                    data-oid="n4_c4s9"
                  ></span>
                  Haftalık verimlilik trendleri
                </li>
                <li className="flex items-center gap-2" data-oid="eml67.m">
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"
                    data-oid="lj0jxlo"
                  ></span>
                  Hedef karşılaştırmaları
                </li>
              </ul>
            </div>
          </div>

          {/* v4.1 NEW: Call to action with enhanced styling */}
          <div className="text-center mt-16" data-oid="30jykcd">
            <div
              className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
              data-oid="ropdrr_"
            >
              {/* Background decoration */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 backdrop-blur-sm z-0"
                data-oid=".xbvn7x"
              ></div>

              <div className="relative z-10" data-oid="gi:i:rf">
                <h3
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
                  data-oid="o86eg7o"
                >
                  Odaklanma Yolculuğunuza Başlayın
                </h3>
                <p
                  className="text-lg md:text-xl mb-8 text-orange-100 max-w-2xl mx-auto"
                  data-oid="g13q-.5"
                >
                  Bugün ilk pomodoro seansınızı başlatın ve verimliliğinizin
                  nasıl arttığını görün.
                </p>
                <Link
                  href="/home"
                  className="inline-flex items-center gap-3 bg-white text-orange-600 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-orange-50 transition-all duration-300 hover:scale-105 shadow-2xl relative z-20"
                  data-oid="337zhdc"
                >
                  🚀 Hemen Başla
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="0vd8xvx"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                      data-oid="b9dhn3c"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
