"use client";

import { useState } from "react";
import { useAuth } from "@/stores/authStore";

const AccountDeletionSection: React.FC = () => {
  const { getAccessToken } = useAuth();
  const [status, setStatus] = useState<"idle" | "requested" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initiateDeletion = async () => {
    setLoading(true);
    setMessage(null);
    const token = getAccessToken();
    if (!token) {
      setMessage("Kullanıcı doğrulama hatası.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/initiate-deletion`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setStatus("requested");
        setMessage(data.message || "Hesap silme onay e-postası gönderildi.");
      } else {
        setStatus("error");
        setMessage(data.message || "Hesap silme isteği başarısız.");
      }
    } catch {
      setStatus("error");
      setMessage("Ağ hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    setLoading(true);
    setMessage(null);
    const token = getAccessToken();
    if (!token) {
      setMessage("Kullanıcı doğrulama hatası.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/resend-deletion-email`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Onay e-postası yeniden gönderildi.");
      } else {
        setMessage(data.message || "Onay e-postası gönderilemedi.");
      }
    } catch {
      setMessage("Ağ hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h3 className="text-lg font-medium">Hesap Silme Talebi</h3>
      {message && (
        <p
          className={`${
            status === "requested" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      {status === "idle" && (
        <button
          onClick={initiateDeletion}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Gönderiliyor..." : "Silme Talebi Gönder"}
        </button>
      )}
      {status === "requested" && (
        <button
          onClick={resendEmail}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Gönderiliyor..." : "E-postayı Yeniden Gönder"}
        </button>
      )}
    </div>
  );
};

export default AccountDeletionSection;
