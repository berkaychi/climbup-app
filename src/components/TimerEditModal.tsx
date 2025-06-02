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
    initialCustomWorkMinutes,
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
      data-oid="-wh.k.q"
    >
      <div
        className="bg-white rounded-lg p-6 w-80 shadow-xl"
        data-oid="pfvblj:"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="qjh.caa"
        >
          <h3 className="text-lg font-medium text-gray-800" data-oid="qfzup55">
            Zamanlayıcıyı Düzenle
          </h3>
          <button
            id="closeModal"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            data-oid="lcmn34-"
          >
            <div
              className="w-6 h-6 flex items-center justify-center"
              data-oid="k255280"
            >
              <i className="ri-close-line" data-oid="7mqg.sc"></i>
            </div>
          </button>
        </div>
        <div className="mb-4" data-oid="bm6nhso">
          <label
            htmlFor="customWorkDurationInput"
            className="block text-sm font-medium text-gray-700 mb-1"
            data-oid="ka5404s"
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
            data-oid=".5p80ig"
          />
        </div>
        {/* Mola Süresi input alanı kaldırıldı */}
        <div className="flex justify-end mt-6" data-oid="gaw6jkx">
          <button
            id="saveTimer"
            className="px-4 py-2 bg-primary text-white font-medium rounded-button shadow hover:bg-primary/90 !rounded-button whitespace-nowrap"
            onClick={handleSave}
            data-oid="-iug:v3"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerEditModal;
