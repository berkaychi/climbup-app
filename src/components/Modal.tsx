import React from "react";
import { ModalState } from "@/hooks/useModal";

interface ModalProps {
  modal: ModalState;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ modal, onConfirm, onCancel }) => {
  if (!modal.isOpen) return null;

  const getIconAndColors = () => {
    switch (modal.type) {
      case "success":
        return {
          icon: "✓",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-400",
          buttonColor: "bg-green-600 hover:bg-green-700",
        };
      case "error":
        return {
          icon: "!",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: "⚠",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          icon: "ℹ",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const { icon, bgColor, iconColor, buttonColor } = getIconAndColors();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={modal.showCancel ? onCancel : onConfirm}
        />

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl sm:my-8 sm:align-middle sm:p-6">
          <div className="text-center">
            {/* Icon */}
            <div
              className={`w-16 h-16 mx-auto ${bgColor} rounded-full flex items-center justify-center mb-4`}
            >
              <span className={`text-3xl ${iconColor}`}>{icon}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {modal.title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {modal.message}
            </p>

            {/* Buttons */}
            <div
              className={`flex gap-3 ${
                modal.showCancel ? "justify-end" : "justify-center"
              }`}
            >
              {modal.showCancel && (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={onCancel}
                >
                  {modal.cancelText}
                </button>
              )}
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${buttonColor}`}
                onClick={onConfirm}
              >
                {modal.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
