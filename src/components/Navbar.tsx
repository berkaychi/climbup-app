"use client";

import Link from "next/link";
import Image from "next/image"; // Profil resmi için
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation"; // Aktif linki belirlemek için
import ThemeToggle from "./ThemeToggle";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState } from "react";

// Pacifico fontu layout.tsx'te global olarak tanımlandığı ve CSS değişkeni (--font-pacifico)
// aracılığıyla erişilebilir olduğu için burada tekrar import etmeye veya tanımlamaya gerek yok.
// Tailwind config'e `fontFamily: { pacifico: ['var(--font-pacifico)'] }` ekleyip
// className="font-pacifico" kullanmak en temiz yoldur.
// Şimdilik doğrudan `font-[var(--font-pacifico)]` kullanacağız.

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const { userProfile, isLoadingUserProfile } = useUserProfile();

  return (
    <nav
      className="px-6 py-4 backdrop-blur-md border-b border-white/20 dark:border-gray-700/30 relative z-50 transition-colors duration-300"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
      }}
    >
      {/* Dark mode overlay */}
      <div className="absolute inset-0 bg-gray-800/90 dark:block hidden"></div>

      <div className="container mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="text-3xl font-pacifico font-bold text-orange-600 dark:text-orange-400 transition-all duration-300 hover:scale-105 hover:text-orange-500 dark:hover:text-orange-300"
          >
            ClimbUp
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              pathname === "/"
                ? "text-white shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
            style={pathname === "/" ? { backgroundColor: "#F96943" } : {}}
          >
            Zamanlayıcı
          </Link>
          {user && (
            <>
              <Link
                href="/plan"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  pathname === "/plan"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
                style={
                  pathname === "/plan" ? { backgroundColor: "#F96943" } : {}
                }
              >
                Plan
              </Link>
              <Link
                href="/profile"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  pathname === "/profile"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
                style={
                  pathname === "/profile" ? { backgroundColor: "#F96943" } : {}
                }
              >
                Profil
              </Link>
              <Link
                href="/leaderboard"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  pathname === "/leaderboard"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
                style={
                  pathname === "/leaderboard"
                    ? { backgroundColor: "#F96943" }
                    : {}
                }
              >
                🏆 Liderlik
              </Link>
              <Link
                href="/tags"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  pathname === "/tags"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
                style={
                  pathname === "/tags" ? { backgroundColor: "#F96943" } : {}
                }
              >
                Etiketlerim
              </Link>
              <div className="relative group">
                <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-4 py-2 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30">
                  Diğer
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-600/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 rounded-t-xl transition-colors"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    🏆 Liderlik Tablosu
                  </Link>
                  <Link
                    href="/rewards"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Ödüller
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 rounded-b-xl transition-colors"
                  >
                    Hesap Ayarları
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Stepstone Balance */}
          {user &&
            (isLoadingUserProfile ? (
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
            ) : (
              <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium px-2 py-1 bg-orange-50 dark:bg-orange-900/30 rounded-full">
                <span className="mr-1">🪙</span>
                {userProfile?.stepstones}
              </div>
            ))}
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* User Profile Section */}
          <div className="relative group">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-gray-700/60 animate-pulse"></div>
            ) : user ? (
              <>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 transform hover:scale-105 border border-white/40 dark:border-gray-600/40"
                >
                  {user.profilePictureUrl ? (
                    <Image
                      src={user.profilePictureUrl}
                      alt={user.fullName || user.userName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </button>
                <div
                  className={`absolute right-0 mt-2 w-52 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-600/30 transition-all duration-300 z-50 ${
                    profileOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  } group-hover:opacity-100 group-hover:visible`}
                >
                  <div className="px-4 py-3 border-b border-gray-100/50 dark:border-gray-600/50">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Merhaba, {user.fullName || user.userName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    🏆 Liderlik Tablosu
                  </Link>
                  <Link
                    href="/rewards"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Ödüller
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Hesap Ayarları
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-red-500 dark:text-red-400 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-b-xl transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all duration-300"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #F96943 0%, #E55527 100%)",
                    boxShadow: "0 4px 15px rgba(249, 105, 67, 0.3)",
                  }}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - only show on mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/40 dark:border-gray-600/40 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-white/20 dark:border-gray-700/30 z-50">
          <Link
            href="/"
            className={`block px-4 py-2 rounded-full text-sm font-medium ${
              pathname === "/"
                ? "text-white shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            Zamanlayıcı
          </Link>
          {user ? (
            <>
              <Link
                href="/plan"
                className={`block px-4 py-2 rounded-full text-sm font-medium ${
                  pathname === "/plan"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              >
                Plan
              </Link>
              <Link
                href="/profile"
                className={`block px-4 py-2 rounded-full text-sm font-medium ${
                  pathname === "/profile"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              >
                Profil
              </Link>
              <Link
                href="/leaderboard"
                className={`block px-4 py-2 rounded-full text-sm font-medium ${
                  pathname === "/leaderboard"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              >
                🏆 Liderlik
              </Link>
              <Link
                href="/tags"
                className={`block px-4 py-2 rounded-full text-sm font-medium ${
                  pathname === "/tags"
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400"
                }`}
              >
                Etiketlerim
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-500 dark:text-red-400 hover:bg-white/80 dark:hover:bg-gray-700/50 rounded-b-xl transition-colors"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                href="/login"
                className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all duration-300"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #F96943 0%, #E55527 100%)",
                  boxShadow: "0 4px 15px rgba(249, 105, 67, 0.3)",
                }}
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
