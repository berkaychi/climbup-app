import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface UploadPhotoModalProps {
  onClose: () => void;
}

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({ onClose }) => {
  const { getAccessToken, updateUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Lütfen bir dosya seçin.");
      return;
    }
    const accessToken = getAccessToken();
    if (!accessToken) {
      setError("Kullanıcı doğrulaması başarısız.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Users/me/profile-picture`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.profilePictureUrl) {
        updateUser({ profilePictureUrl: data.profilePictureUrl });
      }
      onClose();
    } else {
      const errData = await response.json();
      setError(errData.message || "Resim yüklenirken hata oluştu.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 relative z-10 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Profil Fotoğrafını Güncelle
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Önizleme"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Önizleme
                </span>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-md"
            >
              {isSubmitting ? "Yükleniyor..." : "Yükle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
