"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ConfirmEmailChangeClient: React.FC = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("E-posta adresiniz onaylanıyor...");

  useEffect(() => {
    if (!userId || !token) {
      setStatus("error");
      setMessage(
        "Eksik bilgi: Kullanıcı ID veya token bulunamadı. Lütfen bağlantıyı kontrol edin."
      );
      return;
    }

    const confirmEmailChange = async () => {
      setStatus("loading");
      setMessage("E-posta adresiniz onaylanıyor...");
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/Users/confirm-email-change?userId=${encodeURIComponent(
            userId
          )}&token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(
            data.message ||
              "E-posta adresiniz başarıyla onaylandı ve güncellendi."
          );
        } else {
          setStatus("error");
          setMessage(
            data.message ||
              "E-posta onayı başarısız oldu. Lütfen bağlantıyı kontrol edin."
          );
        }
      } catch {
        setStatus("error");
        setMessage("Ağ hatası. Lütfen tekrar deneyin.");
      }
    };

    confirmEmailChange();
  }, [userId, token]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-orange-600">📧</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              E-posta Onaylanıyor...
            </h1>
            <div className="w-9 h-9 mx-auto border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin my-5"></div>
            <p className="text-gray-600 dark:text-gray-400">Lütfen bekleyin.</p>
          </div>
        );
      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-green-600">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
              E-posta Başarıyla Onaylandı!
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{message}</p>
            <Link
              href="/login"
              className="mt-6 inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        );
      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-red-600">!</span>
            </div>
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
              E-posta Onayı Başarısız!
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{message}</p>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Bu sayfayı şimdi kapatabilir veya{" "}
              <Link href="/" className="text-orange-600 hover:underline">
                ana sayfaya
              </Link>{" "}
              dönebilirsiniz.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
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
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
          {renderContent()}
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

export default ConfirmEmailChangeClient;
