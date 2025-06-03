"use client";

import { useState, useEffect } from "react";
// import { Tag } from "@/types/tag"; // Assuming Tag type might be needed later for tag selection in modal - Removed as it's not used yet and causes error

interface TimerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customWorkMinutes: number) => void; // Only custom work duration
  initialCustomWorkMinutes: number;
  // selectedTags and apiTags might be passed if tag selection happens directly in modal
  // selectedTags: Tag[];
  // apiTags: Tag[];
}

const TimerEditModal: React.FC<TimerEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCustomWorkMinutes,
}) => {
  const [customWorkDurationInput, setCustomWorkDurationInput] = useState(
    initialCustomWorkMinutes
  );

  useEffect(() => {
    setCustomWorkDurationInput(initialCustomWorkMinutes);
  }, [initialCustomWorkMinutes, isOpen]); // isOpen değiştiğinde de sıfırla

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(customWorkDurationInput);
    onClose();
  };

  return (
    <div
      id="timerEditModal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Modal dışına tıklandığında kapat
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Zamanlayıcıyı Düzenle
          </h3>
          <button
            id="closeModal"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-close-line"></i>
            </div>
          </button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="customWorkDurationInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Çalışma Süresi (dk)
          </label>
          <input
            id="customWorkDurationInput"
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={customWorkDurationInput}
            onChange={(e) =>
              setCustomWorkDurationInput(parseInt(e.target.value, 10))
            }
            min="1"
            max="180" // Max duration can be adjusted as needed
          />
        </div>
        {/* Mola Süresi input alanı kaldırıldı */}
        <div className="flex justify-end mt-6">
          <button
            id="saveTimer"
            className="px-4 py-2 bg-primary text-white font-medium rounded-button shadow hover:bg-primary/90 !rounded-button whitespace-nowrap"
            onClick={handleSave}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerEditModal;
