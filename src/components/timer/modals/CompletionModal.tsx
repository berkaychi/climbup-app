"use client";

import { SessionTypeResponseDto } from "../../../hooks/useSessionTypes";
import { FocusSessionResponseDto } from "../../../types/focusSession";

export type CompletionModalType =
  | "workToBreak"
  | "breakToWork"
  | "sessionComplete"
  | "lastCycleWorkToBreak"
  | "lastCycleBreakComplete"
  | "customWorkComplete"
  | "customBreakComplete";

interface CompletionModalProps {
  isOpen: boolean;
  modalType: CompletionModalType;
  activeFocusSession: FocusSessionResponseDto | null;
  sessionTypes: SessionTypeResponseDto[] | null;
  onStartBreak: () => void;
  onCancel: () => void;
  onStartUIBreak: (duration: number) => void;
}

export default function CompletionModal({
  isOpen,
  modalType,
  activeFocusSession,
  sessionTypes,
  onStartBreak,
  onCancel,
  onStartUIBreak,
}: CompletionModalProps) {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (modalType) {
      case "workToBreak":
        return "Çalışma Tamamlandı!";
      case "breakToWork":
        return "Mola Tamamlandı!";
      case "lastCycleWorkToBreak":
        return "Son Cycle Çalışması Tamamlandı!";
      case "lastCycleBreakComplete":
        return "Tebrikler! Oturumunuz Başarıyla Tamamlandı!";
      case "customWorkComplete":
        return "Çalışma Tamamlandı!";
      case "customBreakComplete":
        return "Tebrikler! Özel Süre Tamamlandı!";
      default:
        return "Oturum Tamamlandı!";
    }
  };

  const getMessage = () => {
    switch (modalType) {
      case "workToBreak":
        return "Harika! Çalışma süreniz tamamlandı.";
      case "breakToWork":
        return "Mola süreniz doldu. Çalışmaya hazır mısınız?";
      case "lastCycleWorkToBreak":
        return "Bu oturumun son çalışma süresi tamamlandı! Son bir mola yapmak ister misiniz?";
      case "lastCycleBreakComplete":
        return "Harika! Tüm çalışma ve mola sürelerinizi başarıyla tamamladınız.";
      case "customWorkComplete":
        return "Harika! Özel çalışma süreniz tamamlandı.";
      case "customBreakComplete":
        return "Mola süreniz doldu. Yeni bir odak oturumu başlatabilirsiniz.";
      default:
        return "Tebrikler! Oturumunuz başarıyla tamamlandı.";
    }
  };

  const getSessionTypeName = () => {
    if (activeFocusSession?.sessionTypeId && sessionTypes) {
      return (
        sessionTypes.find((st) => st.id === activeFocusSession.sessionTypeId)
          ?.name || "Bilinmeyen Mod"
      );
    }
    return "Özel Süre";
  };

  const getDescriptionText = () => {
    if (modalType === "workToBreak" || modalType === "lastCycleWorkToBreak") {
      return (
        <>
          <p className="mb-2" data-oid="ystt.j2">
            Ne yapmak istiyorsunuz?
          </p>
          <p
            className="text-sm text-gray-500 dark:text-gray-400"
            data-oid="b53xql."
          >
            {modalType === "lastCycleWorkToBreak"
              ? "İsteğe bağlı olarak son molaya başlayabilir veya oturumu tamamlayabilirsiniz."
              : "Molaya başlayabilir veya oturumu sonlandırabilirsiniz."}
          </p>
        </>
      );
    }
    if (modalType === "breakToWork") {
      return (
        <>
          <p className="mb-2" data-oid="6plxv_3">
            Ne yapmak istiyorsunuz?
          </p>
          <p
            className="text-sm text-gray-500 dark:text-gray-400"
            data-oid="2b1isi1"
          >
            Çalışmaya devam edebilir veya oturumu sonlandırabilirsiniz.
          </p>
        </>
      );
    }
    if (
      modalType === "sessionComplete" ||
      modalType === "lastCycleBreakComplete" ||
      modalType === "customBreakComplete"
    ) {
      return (
        <p
          className="text-sm text-gray-500 dark:text-gray-400"
          data-oid="cgfq_nw"
        >
          {modalType === "lastCycleBreakComplete"
            ? "Yeni bir odak oturumu başlatabilirsiniz."
            : "Yeni bir oturum başlatabilirsiniz."}
        </p>
      );
    }
    return null;
  };

  const getCancelButtonText = () => {
    if (
      modalType === "sessionComplete" ||
      modalType === "lastCycleBreakComplete" ||
      modalType === "customBreakComplete"
    ) {
      return "Tamam";
    }
    if (modalType === "lastCycleWorkToBreak") {
      return "Oturumu Tamamla";
    }
    if (modalType === "customWorkComplete") {
      return "Bitir";
    }
    return "Oturumu Sonlandır";
  };

  const getStartButtonText = () => {
    if (modalType === "workToBreak" || modalType === "lastCycleWorkToBreak") {
      return "Molaya Başla";
    }
    return "Çalışmaya Başla";
  };

  const shouldShowStartButton = () => {
    return (
      modalType === "workToBreak" ||
      modalType === "breakToWork" ||
      modalType === "lastCycleWorkToBreak"
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      data-oid="zum6425"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        data-oid="isg6pq-"
      >
        <div
          className="flex justify-between items-center mb-6"
          data-oid="sad760i"
        >
          <h3
            className="text-xl font-semibold text-gray-800 dark:text-gray-200"
            data-oid="qk:8h6:"
          >
            {getTitle()}
          </h3>
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="5:kywvp"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              data-oid="2-u805g"
            />
          </svg>
        </div>

        <div className="space-y-4 mb-6" data-oid="cm4xrb5">
          <div
            className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4"
            data-oid="ys8qjac"
          >
            <div className="text-center" data-oid="nwyv15o">
              <div
                className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2"
                data-oid="os5zr3h"
              >
                {getMessage()}
              </div>
              <div
                className="text-sm text-gray-600 dark:text-gray-400"
                data-oid="-4xut.g"
              >
                {getSessionTypeName()}
              </div>
            </div>
          </div>

          {modalType === "customWorkComplete" && (
            <div className="space-y-3" data-oid="_mv6n44">
              <p
                className="text-center text-gray-700 dark:text-gray-300 mb-3"
                data-oid="xqr-o1d"
              >
                Ne yapmak istiyorsunuz?
              </p>
              <div className="grid grid-cols-3 gap-2" data-oid="yv7wzz.">
                {[5, 10, 15].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => onStartUIBreak(duration)}
                    className="px-4 py-3 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-xl transition-colors text-sm font-medium"
                    data-oid="w9hs6sv"
                  >
                    {duration} dk mola
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className="text-center text-gray-700 dark:text-gray-300"
            data-oid="k7is1yc"
          >
            {getDescriptionText()}
          </div>
        </div>

        <div className="flex gap-3" data-oid="zr42od.">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            data-oid="1wcc8r:"
          >
            {getCancelButtonText()}
          </button>
          {shouldShowStartButton() && (
            <button
              onClick={onStartBreak}
              className="flex-1 px-6 py-3 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              style={{ backgroundColor: "#F96943" }}
              data-oid="ni4371:"
            >
              {getStartButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
