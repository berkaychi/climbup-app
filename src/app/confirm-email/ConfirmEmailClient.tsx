"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ConfirmEmailClient = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Onaylanıyor...");

  useEffect(() => {
    if (!userId || !token) {
      setStatus("error");
      setMessage("Geçersiz bağlantı.");
      return;
    }
    const confirmEmail = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/Auth/confirm-email?userId=${encodeURIComponent(
            userId
          )}&token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "E-posta başarıyla onaylandı.");
        } else {
          setStatus("error");
          setMessage(data.message || "E-posta onayı başarısız.");
        }
      } catch {
        setStatus("error");
        setMessage("Ağ hatası oluştu.");
      }
    };
    confirmEmail();
  }, [userId, token]);

  return (
    <div className="max-w-md mx-auto p-6">
      {status === "loading" && <p className="text-gray-700">{message}</p>}
      {status === "success" && <p className="text-green-600">{message}</p>}
      {status === "error" && <p className="text-red-600">{message}</p>}
    </div>
  );
};

export default ConfirmEmailClient;
