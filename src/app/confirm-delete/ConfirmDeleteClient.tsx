"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ConfirmDeleteClient = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const auth = useAuth();

  const [status, setStatus] = useState<
    "form" | "loading" | "success" | "error"
  >("form");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  const [deletionReasons, setDeletionReasons] = useState<string[]>([]);
  const [missingFeatures, setMissingFeatures] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");

  // New state for the final confirmation modal
  const [isFinalConfirmModalOpen, setFinalConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (!token && status === "form") {
      setStatus("error");
      setMessage(
        "Silme bağlantısı geçersiz veya eksik. Lütfen e-postanızdaki bağlantıyı kontrol edin veya destek ile iletişime geçin."
      );
    }
  }, [token, status]);

  const handleCheckboxChange = (
    value: string,
    stateUpdater: React.Dispatch<React.SetStateAction<string[]>>,
    currentValues: string[]
  ) => {
    if (currentValues.includes(value)) {
      stateUpdater(currentValues.filter((item) => item !== value));
    } else {
      stateUpdater([...currentValues, value]);
    }
  };

  const proceedWithDeletion = async () => {
    if (!token) {
      setStatus("error");
      setMessage("Silme token'ı bulunamadı. İşlem yapılamıyor.");
      setFinalConfirmModalOpen(false);
      return;
    }

    setStatus("loading");
    setMessage("Hesabınız siliniyor, lütfen bekleyin...");
    setFinalConfirmModalOpen(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/confirm-deletion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            deletionReasons:
              deletionReasons.length > 0 ? deletionReasons : undefined,
            missingFeatures:
              missingFeatures.length > 0 ? missingFeatures : undefined,
            feedbackText: feedbackText || undefined,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Hesabınız başarıyla silindi.");
        setUserName(data.userName || "Climber");
        auth.logout(false);
      } else {
        setStatus("error");
        setMessage(
          data.message ||
            `Hesap silme işlemi başarısız oldu (Kod: ${res.status}). Lütfen tekrar deneyin veya destek ile iletişime geçin.`
        );
      }
    } catch (error) {
      console.error("Confirm Deletion API call error:", error);
      setStatus("error");
      setMessage(
        "Hesap silme sırasında bir ağ hatası veya beklenmedik bir sorun oluştu."
      );
    }
  };

  const handleSubmitRequest = (e: FormEvent) => {
    e.preventDefault();
    setFinalConfirmModalOpen(true); // Open the final confirmation modal
  };

  return (
    <>
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

        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full">
            {status === "loading" && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-orange-600">🗑️</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Hesabınız Siliniyor...
                </h1>
                <div className="w-9 h-9 mx-auto border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin my-5"></div>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-green-600">✓</span>
                </div>
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
                  Hesabınız Başarıyla Silindi!
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Merhaba <span className="font-semibold">{userName}</span>,
                  ClimbUp&apos;taki yolculuğunuzda bize katıldığınız için
                  teşekkür ederiz.
                </p>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Birkaç saniye içinde çıkış sayfasına yönlendirileceksiniz.
                </p>
              </div>
            )}

            {status === "error" && !isFinalConfirmModalOpen && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-red-600">!</span>
                </div>
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                  Bir Hata Oluştu!
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {message}
                </p>
                <Link href="/" className="text-orange-600 hover:underline">
                  Ana sayfaya dön
                </Link>
              </div>
            )}

            {status === "form" && !isFinalConfirmModalOpen && (
              <>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-10 h-10 text-red-500 dark:text-red-400"
                    >
                      <path d="M14 14.252V16.5H12.5V14.252C10.839 13.971 9.5 12.648 9.5 11V6.5C9.5 4.019 11.519 2 14 2C16.481 2 18.5 4.019 18.5 6.5V11C18.5 12.648 17.161 13.971 15.5 14.252V16.5H14V14.252ZM14 4C12.621 4 11.5 5.122 11.5 6.5V11C11.5 11.827 12.173 12.5 13 12.5H15C15.827 12.5 16.5 11.827 16.5 11V6.5C16.5 5.122 15.379 4 14 4Z" />
                      <path d="M20.7932 19.7932L15.586 14.586C15.8216 14.4047 16.0397 14.1991 16.2355 13.973L20.7355 18.473C21.126 18.8635 21.126 19.4967 20.7355 19.8872L20.7932 19.7932ZM3.26447 18.473L7.76447 13.973C7.96029 14.1991 8.17841 14.4047 8.41397 14.586L3.20677 19.7932C2.81625 20.1837 2.18308 20.1837 1.79256 19.7932C1.40203 19.4027 1.40203 18.7695 1.79256 18.379L3.26447 18.473Z" />
                      <path d="M6 18H18V20H6V18Z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Hesap Silme İşlemini Onayla
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Bu son adımdır. Hesabınızı silmek tüm verilerinizi kalıcı
                    olarak yok edecektir. Aşağıdaki formu doldurarak veya
                    doğrudan silme işlemini onaylayarak devam edebilirsiniz.
                  </p>
                </div>
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Hesabınızı silme nedeniniz nedir? (İsteğe bağlı)
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          value: "not_useful",
                          label: "Uygulama benim için faydalı değil",
                        },
                        {
                          value: "too_complex",
                          label: "Kullanımı çok karmaşık",
                        },
                        {
                          value: "found_alternative",
                          label: "Başka bir uygulama kullanıyorum",
                        },
                        {
                          value: "privacy_concerns",
                          label: "Gizlilik endişelerim var",
                        },
                        { value: "other", label: "Diğer" },
                      ].map((reason) => (
                        <label
                          key={reason.value}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={reason.value}
                            checked={deletionReasons.includes(reason.value)}
                            onChange={() =>
                              handleCheckboxChange(
                                reason.value,
                                setDeletionReasons,
                                deletionReasons
                              )
                            }
                            className="text-orange-600 focus:ring-orange-500 h-4 w-4 border-gray-300 dark:border-gray-600 rounded"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {reason.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Hangi özellikler eksikti veya geliştirilebilirdi? (İsteğe
                      bağlı)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          value: "timer_options",
                          label: "Zamanlayıcı seçenekleri",
                        },
                        { value: "statistics", label: "İstatistikler" },
                        { value: "integrations", label: "Entegrasyonlar" },
                        { value: "customization", label: "Kişiselleştirme" },
                        { value: "offline_mode", label: "Çevrimdışı mod" },
                      ].map((feature) => (
                        <label
                          key={feature.value}
                          className="flex items-center px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-400 cursor-pointer has-[:checked]:bg-orange-50 dark:has-[:checked]:bg-orange-900/30 has-[:checked]:border-orange-500 dark:has-[:checked]:border-orange-400 transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={feature.value}
                            checked={missingFeatures.includes(feature.value)}
                            onChange={() =>
                              handleCheckboxChange(
                                feature.value,
                                setMissingFeatures,
                                missingFeatures
                              )
                            }
                            className="sr-only"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="feedbackText"
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                    >
                      Ek geri bildiriminiz var mı? (İsteğe bağlı)
                    </label>
                    <textarea
                      id="feedbackText"
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      placeholder="Deneyiminizi bizimle paylaşın..."
                    ></textarea>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link
                      href="/home"
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-medium"
                    >
                      Vazgeç ve Ana Sayfaya Dön
                    </Link>
                    <button
                      type="submit"
                      disabled={!token}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50"
                    >
                      Hesabımı Kalıcı Olarak Sil
                    </button>
                  </div>
                </form>
              </>
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

      {/* Final Confirmation Modal */}
      {isFinalConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Emin Misiniz?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-center">
              Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak
              silinecektir. Devam etmek istediğinizden emin misiniz?
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setFinalConfirmModalOpen(false)}
                disabled={status === "loading"}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors disabled:opacity-60"
              >
                Vazgeç
              </button>
              <button
                onClick={proceedWithDeletion}
                disabled={status === "loading"}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {status === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Siliniyor...
                  </>
                ) : (
                  "Evet, Kalıcı Olarak Sil"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmDeleteClient;
