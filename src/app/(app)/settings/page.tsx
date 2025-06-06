"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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

  if (isLoading || !user) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      {/* Profil Bilgileri */}
      <section className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
        <h2 className="text-2xl font-semibold mb-4">Profil Bilgileri</h2>
        <div className="flex items-center space-x-6">
          <div>
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 flex items-center justify-center text-white text-2xl font-bold rounded-full">
                {user.fullName
                  ? user.fullName[0].toUpperCase()
                  : user.userName[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p>
              <strong>Ad Soyad:</strong> {userProfile?.fullName}
            </p>
            <p>
              <strong>Kullanıcı Adı:</strong> {userProfile?.userName}
            </p>
            <p>
              <strong>E-posta:</strong> {userProfile?.email}
            </p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => setEditModalOpen(true)}
                className="cursor-pointer px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
              >
                Profili Düzenle
              </button>
              <button
                onClick={() => setPhotoModalOpen(true)}
                className="cursor-pointer px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
              >
                Fotoğraf Yükle
              </button>
            </div>
          </div>
        </div>
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            onClose={() => setEditModalOpen(false)}
          />
        )}
        {isPhotoModalOpen && (
          <UploadPhotoModal onClose={() => setPhotoModalOpen(false)} />
        )}
      </section>

      {/* Güvenlik Ayarları */}
      <section className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
        <h2 className="text-2xl font-semibold mb-4">Güvenlik Ayarları</h2>
        <div className="space-y-6">
          <ChangePasswordForm />
          <ActiveSessionsManager />
        </div>
      </section>

      {/* Hesap Yönetimi */}
      <section className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
        <h2 className="text-2xl font-semibold mb-4">Hesap Yönetimi</h2>
        <AccountDeletionSection />
      </section>
    </div>
  );
}
