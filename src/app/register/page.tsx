"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    // Şifre eşleşme kontrolü
    if (password !== confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor. Lütfen şifrenizi kontrol edin.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://climbupapi.duckdns.org/api/Auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, userName, email, password }),
        },
      );

      const data = await response.json();

      if (response.status === 201) {
        // Created
        setSuccessMessage(
          "Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı onaylayın. Onay sonrası giriş yapabilirsiniz. (3 saniye içinde Giriş sayfasına yönlendirileceksiniz)",
        );
        setFullName("");
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setErrorMessage(data.errors.join("\\n")); // Hataları yeni satırla birleştir
        } else {
          setErrorMessage(
            data.message ||
              "Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.",
          );
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(
        "Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      data-oid="qblof9_"
    >
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20" data-oid="lgvyk-s">
        <ThemeToggle data-oid=".v1mwet" />
      </div>
      {/* Merkezi Kart */}
      <div
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 lg:p-10 relative border border-gray-100 dark:border-gray-700"
        data-oid="yrq17qo"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 rounded-2xl backdrop-blur-sm"
          data-oid="c9-g-5l"
        ></div>
        {/* ClimbUp Logo */}
        <div className="text-center mb-8 relative z-10" data-oid="028142h">
          <h1
            className="text-4xl font-pacifico font-bold text-orange-600 dark:text-orange-400 mb-2"
            data-oid="q51nzn."
          >
            ClimbUp
          </h1>
          <p
            className="text-gray-600 dark:text-gray-300 text-lg"
            data-oid="4iik.bp"
          >
            Zirveye odaklan, hedefine ulaş
          </p>
        </div>

        {/* Kayıt Formu */}
        <div className="relative z-10" data-oid="8tmz2fu">
          <h2
            className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center"
            data-oid="c9wn.dg"
          >
            Hesap Oluştur
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-oid="462ifp:"
          >
            <div data-oid="ucz8osh">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid=":uqi7ua"
              >
                Ad Soyad
              </label>
              <div className="relative" data-oid="tvv4dmk">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="ho1w98j"
                >
                  <span className="text-gray-400" data-oid="35v83ts">
                    👤
                  </span>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="Adınız ve soyadınız"
                  data-oid="s7j-nus"
                />
              </div>
            </div>

            <div data-oid="y8_48ba">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid="1d8czbf"
              >
                Kullanıcı Adı
              </label>
              <div className="relative" data-oid="m6tgi5b">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid=":w_107x"
                >
                  <span className="text-gray-400" data-oid="g92xr_b">
                    @
                  </span>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="kullaniciadi"
                  data-oid="nn4pyen"
                />
              </div>
            </div>

            <div data-oid="a.s2tgx">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid="cic:._9"
              >
                E-posta Adresi
              </label>
              <div className="relative" data-oid="-f5oag2">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="e_ew5t_"
                >
                  <span className="text-gray-400" data-oid="vkwy5x0">
                    ✉
                  </span>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="ornek@email.com"
                  data-oid="4ojick:"
                />
              </div>
            </div>

            <div data-oid="ool6.np">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid=":ozezne"
              >
                Şifre
              </label>
              <div className="relative" data-oid="x5xzqih">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="13vzj._"
                >
                  <span className="text-gray-400" data-oid="39gsxq5">
                    🔒
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  data-oid="bhqzjfd"
                />

                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  data-oid="fuei8_q"
                >
                  <span className="text-gray-400" data-oid="mo_fgcl">
                    {showPassword ? "👁" : "👁‍🗨"}
                  </span>
                </div>
              </div>
            </div>

            <div data-oid="-wumts9">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                data-oid="jakzmle"
              >
                Şifre Onayı
              </label>
              <div className="relative" data-oid="xlqlbkx">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="-7.v1uk"
                >
                  <span className="text-gray-400" data-oid="s5ra8ri">
                    🔒
                  </span>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="Şifrenizi tekrar girin"
                  autoComplete="new-password"
                  data-oid="zs5n3gd"
                />

                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-oid="i775frk"
                >
                  <span className="text-gray-400" data-oid="0x5wnp.">
                    {showConfirmPassword ? "👁" : "👁‍🗨"}
                  </span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4"
                data-oid="-jxe5n6"
              >
                <p
                  className="text-sm text-red-800 dark:text-red-300 whitespace-pre-line"
                  data-oid="g2-y6ke"
                >
                  {errorMessage}
                </p>
              </div>
            )}

            {successMessage && (
              <div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4"
                data-oid="l3y85nq"
              >
                <p
                  className="text-sm text-green-800 dark:text-green-300"
                  data-oid="a_t9vs1"
                >
                  {successMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-orange-400 font-medium text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
              data-oid="08c.902"
            >
              {loading ? (
                <div
                  className="animate-spin rounded-full h-6 w-6 border-b-2 border-white dark:border-gray-200"
                  data-oid="j0n3d8c"
                ></div>
              ) : (
                "Hesap Oluştur"
              )}
            </button>
          </form>

          {/* Sosyal Medya Girişi */}
          <div className="mt-8" data-oid="p6st:t.">
            <div className="relative" data-oid="cj.o1zh">
              <div
                className="absolute inset-0 flex items-center"
                data-oid="fda4aek"
              >
                <div
                  className="w-full border-t border-gray-300 dark:border-gray-600"
                  data-oid="l8mgut_"
                />
              </div>
              <div
                className="relative flex justify-center text-sm"
                data-oid="-_cih7j"
              >
                <span
                  className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  data-oid="x5fk9c1"
                >
                  Veya şununla devam et
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3" data-oid="42tk-br">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-md text-gray-700 dark:text-gray-300"
                data-oid="jq6fcdr"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  data-oid="ppnfxp4"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    data-oid="0:qx:-u"
                  />

                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    data-oid="bk2vrr2"
                  />

                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    data-oid="2x1.tie"
                  />

                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    data-oid="m_pfok5"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-md text-gray-700 dark:text-gray-300"
                data-oid="ri0q.5h"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="4.a83f_"
                >
                  <path
                    d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                    data-oid="k4g_1u:"
                  />
                </svg>
                Twitter
              </button>
            </div>
          </div>

          {/* Alt Navigasyon */}
          <div className="mt-8 text-center" data-oid="hjmnhmt">
            <p className="text-gray-600 dark:text-gray-400" data-oid="kgkb40r">
              Zaten hesabın var mı?{" "}
              <Link
                href="/login"
                className="font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors duration-200"
                data-oid="2r5sk9_"
              >
                Giriş yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
