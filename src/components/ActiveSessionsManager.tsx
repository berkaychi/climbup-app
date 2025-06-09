"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/stores/authStore";

interface ActiveSession {
  id: number;
  deviceBrowserInfo: string;
  ipAddress: string;
  created: string;
  expires: string;
  lastUsedDate: string;
  isCurrentSession: boolean;
}

const ActiveSessionsManager: React.FC = () => {
  const { getAccessToken, getRefreshToken } = useAuth();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    const token = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!token) {
      setError("Kullanıcı doğrulama hatası.");
      setLoading(false);
      return;
    }
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    if (refreshToken) {
      headers["X-Current-Refresh-Token"] = refreshToken;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/sessions`,
        { headers }
      );
      if (!res.ok) {
        throw new Error(`Hata: ${res.status}`);
      }
      const data: ActiveSession[] = await res.json();
      setSessions(data);
    } catch {
      setError("Oturumlar yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revokeSession = async (id: number) => {
    setActionLoading(true);
    setMessage(null);
    const token = getAccessToken();
    if (!token) {
      setError("Kullanıcı doğrulama hatası.");
      setActionLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/sessions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Oturum sonlandırıldı.");
        fetchSessions();
      } else {
        setError(data.message || "Oturum sonlandırılamadı.");
      }
    } catch {
      setError("Ağ hatası. Lütfen tekrar deneyin.");
    } finally {
      setActionLoading(false);
    }
  };

  const revokeOthers = async () => {
    setActionLoading(true);
    setMessage(null);
    const token = getAccessToken();
    const refreshToken = getRefreshToken();
    if (!token || !refreshToken) {
      setError("Kullanıcı doğrulama hatası.");
      setActionLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/sessions/others`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Current-Refresh-Token": refreshToken,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Diğer oturumlar sonlandırıldı.");
        fetchSessions();
      } else {
        setError(data.message || "Diğer oturumlar sonlandırılamadı.");
      }
    } catch {
      setError("Ağ hatası. Lütfen tekrar deneyin.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Aktif Oturumlar
      </h3>
      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
      {!loading && sessions.length === 0 && <p>Kayıtlı oturum bulunamadı.</p>}
      {!loading && sessions.length > 0 && (
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-4 flex items-center justify-between"
            >
              <div>
                <p>{session.deviceBrowserInfo}</p>
                <p className="text-sm text-gray-500">{session.ipAddress}</p>
                <p className="text-sm text-gray-500">
                  Oluşturma: {new Date(session.created).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Son kullanım:{" "}
                  {new Date(session.lastUsedDate).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => revokeSession(session.id)}
                disabled={session.isCurrentSession || actionLoading}
                className={`px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  session.isCurrentSession
                    ? "bg-green-500 dark:bg-green-600 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                }`}
                title={session.isCurrentSession ? "Mevcut Oturum" : undefined}
              >
                {session.isCurrentSession ? "Şu Anki" : "Kapat"}
              </button>
            </div>
          ))}
          <button
            onClick={revokeOthers}
            disabled={actionLoading}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Diğer Oturumları Kapat
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveSessionsManager;
