"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Şifreler eşleşmiyor.");
      return;
    }
    if (!userId || !token) {
      setStatus("error");
      setMessage("Geçersiz bağlantı.");
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
        setMessage(data.message || "Şifre başarıyla sıfırlandı.");
      } else {
        setStatus("error");
        setMessage(data.message || "Şifre sıfırlama başarısız.");
      }
    } catch {
      setStatus("error");
      setMessage("Ağ hatası oluştu.");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto p-6">
        <p className="text-green-600 mb-4">{message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Şifre Sıfırlama</h1>
      {status === "error" && <p className="text-red-600 mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Yeni Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Şifre Tekrar
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2 bg-orange-600 text-white rounded-md"
        >
          {status === "loading" ? "Yükleniyor..." : "Şifreyi Sıfırla"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
