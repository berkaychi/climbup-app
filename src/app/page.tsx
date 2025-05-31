"use client"; // İstemci tarafı etkileşimleri için

import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section with v4.1 features */}
      <section className="relative overflow-hidden timer-container">
        {/* v4.1 NEW: Enhanced gradient backgrounds with modern interpolation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Büyük Gradient Orb - Sol Üst using enhanced gradients */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 bg-gradient-to-br from-orange-300 to-pink-400 blur-3xl"></div>

          {/* Orta Gradient Orb - Sağ Ortada */}
          <div className="absolute top-1/3 -right-16 w-80 h-80 rounded-full opacity-15 bg-gradient-to-l from-blue-300 to-teal-400 blur-2xl"></div>

          {/* Küçük Gradient Orb - Sol Alt */}
          <div className="absolute -bottom-12 left-1/4 w-64 h-64 rounded-full opacity-25 bg-gradient-to-tr from-emerald-300 to-cyan-400 blur-xl"></div>
        </div>

        <div className="relative px-6 py-20 text-center max-w-5xl mx-auto">
          {/* v4.1 NEW: Text shadows for better visibility */}
          <h1 className="text-6xl md:text-7xl font-bold font-pacifico mb-6 text-shadow-lg pointer-coarse:text-5xl pointer-fine:text-7xl">
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 bg-clip-text text-transparent">
              ClimbUp
            </span>
          </h1>

          {/* v4.1 NEW: Enhanced typography with text-wrap */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 font-medium leading-relaxed text-shadow-sm max-w-3xl mx-auto">
            Odaklanma sürenizi artırın, hedeflerinize ulaşın.{" "}
            <span className="font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Modern ve etkili
            </span>{" "}
            pomodoro tekniği ile verimliliğinizi maksimize edin.
          </p>

          {/* v4.1 NEW: Pointer-aware button sizing */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/focus"
              className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 pointer-coarse:px-12 pointer-coarse:py-6 pointer-fine:px-8 pointer-fine:py-4"
            >
              <span className="flex items-center justify-center gap-2">
                🎯 Odaklanmaya Başla
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>

            <Link
              href="/stats"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 pointer-coarse:px-12 pointer-coarse:py-6 pointer-fine:px-8 pointer-fine:py-4"
            >
              📊 İstatistiklerim
            </Link>
          </div>

          {/* v4.1 NEW: Container query aware stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto timer-container">
            {/* İstatistik Kartları with enhanced shadows */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-shadow-sm">
                Akıllı Zamanlayıcı
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                25 dakika odaklanma, 5 dakika mola. Bilimsel olarak kanıtlanmış
                pomodoro tekniği.
              </p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-shadow-sm">
                İlerleme Takibi
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Günlük, haftalık ve aylık istatistiklerinizi görün.
                Hedeflerinize ne kadar yakın olduğunuzu bilin.
              </p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-shadow-sm">
                Kişiselleştirme
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kendi çalışma tarzınıza uygun zamanlayıcı ayarları. Kısa
                molalar, uzun molalar, hedef belirleme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* v4.1 NEW: Features section with enhanced visual effects */}
      <section className="py-20 px-6 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          {/* v4.1 NEW: Text with better visual hierarchy */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-shadow-md">
              Neden ClimbUp?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Modern teknoloji ile geleneksel pomodoro tekniğini
              birleştiriyoruz. Odaklanma sürenizi artırmak ve hedeflerinize
              ulaşmak hiç bu kadar kolay olmamıştı.
            </p>
          </div>

          {/* v4.1 NEW: Enhanced feature grid with container queries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 timer-container">
            {/* Özellik 1 */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-orange-100 dark:border-orange-800/50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-shadow-sm">
                Odaklanma Gücü
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Bilimsel araştırmalara dayalı 25 dakikalık odaklanma blokları
                ile dikkatinizi artırın. Beyninizin doğal çalışma ritmiyle
                uyumlu bir sistem.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  25 dakika kesintisiz odaklanma
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>5
                  dakika aktif mola
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  15 dakika uzun mola (4 pomodoro sonrası)
                </li>
              </ul>
            </div>

            {/* Özellik 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                📊
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-shadow-sm">
                Detaylı Analitik
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                İlerlemenizi takip edin, güçlü yönlerinizi keşfedin ve gelişim
                alanlarınızı belirleyin. Veriye dayalı içgörüler ile
                verimliliğinizi optimize edin.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Günlük odaklanma süresi
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Haftalık verimlilik trendleri
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Hedef karşılaştırmaları
                </li>
              </ul>
            </div>
          </div>

          {/* v4.1 NEW: Call to action with enhanced styling */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 backdrop-blur-sm"></div>

              <div className="relative">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-shadow-lg">
                  Odaklanma Yolculuğunuza Başlayın
                </h3>
                <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
                  Bugün ilk pomodoro seansınızı başlatın ve verimliliğinizin
                  nasıl arttığını görün.
                </p>
                <Link
                  href="/focus"
                  className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 hover:scale-105 shadow-2xl pointer-coarse:px-12 pointer-coarse:py-6"
                >
                  🚀 Hemen Başla
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
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
