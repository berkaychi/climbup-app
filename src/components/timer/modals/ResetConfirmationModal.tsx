"use client";

interface ResetConfirmationModalProps {
  isOpen: boolean;
  resetType: "session" | "uiBreak";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirmationModal({
  isOpen,
  resetType,
  onConfirm,
  onCancel,
}: ResetConfirmationModalProps) {
  if (!isOpen) return null;

  const getTitle = () => {
    return resetType === "uiBreak"
      ? "Mola Timer'ını Sıfırla"
      : "Oturumu Sıfırla";
  };

  const getMessage = () => {
    return resetType === "uiBreak"
      ? "UI mola timer'ını sıfırlamak istediğinize emin misiniz?"
      : "Mevcut odak oturumunu sıfırlamak ve iptal etmek istediğinize emin misiniz?";
  };

  const getDescription = () => {
    return resetType === "uiBreak"
      ? "Mola timer'ı sıfırlanacak ve duracaktır."
      : "Bu işlem geri alınamaz ve mevcut ilerlemeniz kaybolacaktır.";
  };

  const getConfirmButtonText = () => {
    return resetType === "uiBreak"
      ? "Mola Timer'ını Sıfırla"
      : "Oturumu Sıfırla";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {getTitle()}
          </h3>
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {getMessage()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getDescription()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            {getConfirmButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
