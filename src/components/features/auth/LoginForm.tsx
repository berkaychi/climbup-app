"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/stores/authStore";
import { ErrorHandler, useErrorHandler } from "@/lib/errors/errorHandler";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { login } = useAuth();
  const { handleError } = useErrorHandler();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors([]);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          login(data.accessToken, data.refreshToken, {
            id: data.userId,
            fullName: data.fullName,
            userName: data.userName,
            email: data.email,
            profilePictureUrl: data.profilePictureUrl,
            roles: data.roles || [],
          });
          onSuccess?.();
        } else {
          const errorMessages = data.errors || [
            data.message || "Giriş başarısız.",
          ];
          setErrors(errorMessages);
        }
      } catch (error) {
        const appError = handleError(error, { context: "login" });
        setErrors([ErrorHandler.getUserFriendlyMessage(appError)]);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, handleError, onSuccess]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Giriş Yap
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            E-posta
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="E-posta adresinizi girin"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Şifre
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Şifrenizi girin"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Giriş yapılıyor...
            </>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>

      {/* Links */}
      <div className="mt-6 text-center space-y-2">
        <Link
          href="/forgot-password"
          className="text-primary hover:text-primary/80 text-sm"
        >
          Şifremi unuttum
        </Link>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Kayıt olun
          </Link>
        </div>
      </div>
    </div>
  );
}
