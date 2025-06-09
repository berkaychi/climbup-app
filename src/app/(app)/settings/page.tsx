"use client";

import { useState } from "react";
import { useAuth } from "@/stores/authStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import EditProfileModal from "@/components/EditProfileModal";
import UploadPhotoModal from "@/components/UploadPhotoModal";
import ChangePasswordForm from "../../../components/ChangePasswordForm";
import ActiveSessionsManager from "../../../components/ActiveSessionsManager";
import AccountDeletionSection from "../../../components/AccountDeletionSection";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const { userProfile } = useUserProfile();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Ayarlar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Hesap bilgilerinizi ve tercihlerinizi yönetin
        </p>
      </div>

      <div className="space-y-6">
        {/* Profil Kartı */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 backdrop-blur-sm rounded-2xl border border-orange-200/30 dark:border-orange-700/30 p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="relative">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt="Profil"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-orange-200/50 dark:ring-orange-700/50"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold rounded-2xl ring-4 ring-orange-200/50 dark:ring-orange-700/50">
                    {user.fullName
                      ? user.fullName[0].toUpperCase()
                      : user.userName[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => setPhotoModalOpen(true)}
                  className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {userProfile?.fullName || "İsimsiz Kullanıcı"}
                  </h2>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">
                    @{userProfile?.userName || user.userName}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <span className="text-sm">{userProfile?.email}</span>
                </div>

                <button
                  onClick={() => setEditModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-xl text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 group"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Profili Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Security Settings */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection("security")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Güvenlik Ayarları
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Şifre değiştirme ve aktif oturumlar
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  activeSection === "security" ? "rotate-180" : ""
                }`}
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

            <div
              className={`transition-all duration-300 ease-in-out ${
                activeSection === "security"
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="px-6 pb-6 space-y-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                <ChangePasswordForm />
                <ActiveSessionsManager />
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection("account")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Hesap Yönetimi
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hesap silme ve veri yönetimi
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  activeSection === "account" ? "rotate-180" : ""
                }`}
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

            <div
              className={`transition-all duration-300 ease-in-out ${
                activeSection === "account"
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="px-6 pb-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                <AccountDeletionSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <EditProfileModal user={user} onClose={() => setEditModalOpen(false)} />
      )}
      {isPhotoModalOpen && (
        <UploadPhotoModal onClose={() => setPhotoModalOpen(false)} />
      )}
    </div>
  );
}
