"use client";

import { useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";

const ResetPasswordClient = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!userId || !token) {
      setStatus("error");
      setMessage(
        "Hata: Geçersiz veya eksik kullanıcı ID/token. Lütfen bağlantınızı kontrol edin."
      );
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Hata: Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMessage("Hata: Şifre en az 6 karakter uzunluğunda olmalıdır.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/password/reset/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, token, password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(
          data.message ||
            "Şifre başarıyla sıfırlandı! Artık yeni şifrenizle giriş yapabilirsiniz."
        );
      } else {
        setStatus("error");
        setMessage(
          data.message || `Şifre sıfırlama başarısız oldu (Kod: ${res.status}).`
        );
      }
    } catch {
      setStatus("error");
      setMessage(
        "Bir ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/"
            className="text-2xl font-pacifico text-orange-600 dark:text-orange-500"
          >
            ClimbUp
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6 sm:mb-8">
            Şifrenizi Sıfırlayın
          </h1>

          {status === "success" ? (
            <div className="text-center">
              <p className="text-green-600 dark:text-green-400 mb-4">
                {message}
              </p>
              <Link
                href="/login"
                className="w-full mt-4 inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
              >
                Giriş Yap
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Yeni şifrenizi girin"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Yeni Şifreyi Onaylayın
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Yeni şifrenizi tekrar girin"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              {status === "error" && (
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-70"
              >
                {status === "loading" ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    İşleniyor...
                  </div>
                ) : (
                  "Şifreyi Sıfırla"
                )}
              </button>
            </form>
          )}
        </div>
      </main>
      <footer className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-4 px-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} ClimbUp. Tüm hakları saklıdır.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ResetPasswordClient;
