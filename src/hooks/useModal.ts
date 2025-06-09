import { useState, useCallback } from "react";

export interface ModalOptions {
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export interface ModalState extends ModalOptions {
  isOpen: boolean;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "Tamam",
    cancelText: "İptal",
    showCancel: false,
  });

  const showModal = useCallback((options: ModalOptions) => {
    setModal({
      isOpen: true,
      confirmText: "Tamam",
      cancelText: "İptal",
      showCancel: false,
      type: "info",
      ...options,
    });
  }, []);

  const showAlert = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info"
    ) => {
      showModal({
        title:
          type === "error"
            ? "Hata"
            : type === "success"
            ? "Başarılı"
            : type === "warning"
            ? "Uyarı"
            : "Bilgi",
        message,
        type,
        confirmText: "Tamam",
        showCancel: false,
      });
    },
    [showModal]
  );

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      title: string = "Onay",
      confirmText: string = "Evet",
      cancelText: string = "Hayır"
    ) => {
      showModal({
        title,
        message,
        type: "warning",
        confirmText,
        cancelText,
        showCancel: true,
        onConfirm,
      });
    },
    [showModal]
  );

  const hideModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    modal.onConfirm?.();
    hideModal();
  }, [modal.onConfirm, hideModal]);

  const handleCancel = useCallback(() => {
    modal.onCancel?.();
    hideModal();
  }, [modal.onCancel, hideModal]);

  return {
    modal,
    showModal,
    showAlert,
    showConfirm,
    hideModal,
    handleConfirm,
    handleCancel,
  };
}
