"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/stores/authStore";
import ThemeToggle from "@/components/ThemeToggle";

const LoginPage = () => {
  const { login: authLogin } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Login attempt started"); // Debug

      const response = await fetch(
        "https://climbupapi.duckdns.org/api/Auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailOrUsername, password }),
        }
      );

      const data = await response.json();
      console.log("Login response:", { ok: response.ok, data }); // Debug

      if (response.ok) {
        console.log("Login successful, calling authLogin"); // Debug
        authLogin(data.accessToken, data.refreshToken, {
          id: data.userId,
          fullName: data.fullName,
          userName: data.userName,
          email: data.email,
          profilePictureUrl: data.profilePictureUrl,
          roles: data.roles || [],
        });
        console.log("authLogin called"); // Debug

        // Token'ların kaydedilmesi için kısa bir bekleme süresi
        setTimeout(() => {
          // Sayfa yenileme - middleware otomatik yönlendirme yapacak
          window.location.reload();
        }, 100);
      } else {
        setError(
          data.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      {/* Merkezi Kart */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 lg:p-10 relative border border-gray-100 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 rounded-2xl backdrop-blur-sm"></div>
        {/* ClimbUp Logo */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-pacifico font-bold text-orange-600 dark:text-orange-400 mb-2">
            ClimbUp
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Hedeflerine odaklan, zirveye çık
          </p>
        </div>

        {/* Giriş Formu */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Hesabına Giriş Yap
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Alanı */}
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                E-posta veya Kullanıcı Adı
              </label>
              <input
                type="text"
                id="emailOrUsername"
                name="emailOrUsername"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                placeholder="ornek@email.com veya kullaniciadi"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>

            {/* Şifre Alanı */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M15.54 1.46C13.38 1.16 11.22 1 9 1 4.48 1 1 4.48 1 9s3.48 8 7.99 8c2.21 0 4.37-.8 6.18-2.18l-3.71-3.7A4.475 4.475 0 0 1 12 15.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5c1.38 0 2.63.56 3.54 1.46l3.71-3.7zm-4.4 15.58c1.38-1.38 2.18-3.54 2.18-5.98s-.8-4.6-2.18-6.02l-3.72 3.72c1.4 1.4 2.2 3.56 2.2 5.94s-.8 4.54-2.2 5.94l3.72 3.72z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M15.54 1.46C13.38 1.16 11.22 1 9 1 4.48 1 1 4.48 1 9s3.48 8 7.99 8c2.21 0 4.37-.8 6.18-2.18l-3.71-3.7A4.475 4.475 0 0 1 12 15.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5c1.38 0 2.63.56 3.54 1.46l3.71-3.7zm-4.4 15.58c1.38-1.38 2.18-3.54 2.18-5.98s-.8-4.6-2.18-6.02l-3.72 3.72c1.4 1.4 2.2 3.56 2.2 5.94s-.8 4.54-2.2 5.94l3.72 3.72z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Beni Hatırla ve Şifremi Unuttum */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 dark:text-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                />

                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors duration-200"
                >
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400 dark:text-red-300"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 12 2zm0 18c-4.41 0-8.01-3.6-8.01-8.01C3.99 7.6 7.59 3.99 12 3.99c4.41 0 8.01 3.6 8.01 8.01C20.01 18.4 16.41 22 12 22z" />
                    <path d="M12 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1 1z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-orange-400 font-medium text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white dark:border-gray-200"></div>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          {/* Sosyal Giriş */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Veya şununla devam et
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-md text-gray-700 dark:text-gray-300"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />

                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />

                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />

                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-md text-gray-700 dark:text-gray-300"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
                Twitter
              </button>
            </div>
          </div>

          {/* Kayıt Ol Linki */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Hesabın yok mu?{" "}
              <Link
                href="/register"
                className="font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors duration-200"
              >
                Ücretsiz kayıt ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
