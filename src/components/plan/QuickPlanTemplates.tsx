"use client";

import { TagDto } from "@/hooks/useTags";

interface QuickPlanTemplatesProps {
  tags: TagDto[] | null;
  onShowAddModal: () => void;
}

const PLAN_TEMPLATES = [
  {
    name: "🍅 Pomodoro",
    duration: 25,
    color: "#EF4444",
  },
  {
    name: "📚 Derin Çalışma",
    duration: 120,
    color: "#3B82F6",
  },
  {
    name: "⚡ Hızlı Review",
    duration: 30,
    color: "#F59E0B",
  },
  {
    name: "🏃 Egzersiz",
    duration: 60,
    color: "#10B981",
  },
];

export default function QuickPlanTemplates({
  tags,
  onShowAddModal,
}: QuickPlanTemplatesProps) {
  const handleTemplateClick = (template: (typeof PLAN_TEMPLATES)[0]) => {
    onShowAddModal();
    // Pre-fill the modal with template data
    setTimeout(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const titleInput = modal.querySelector(
          'input[placeholder*="Örn"]'
        ) as HTMLInputElement;
        const durationInput = modal.querySelector(
          'input[type="number"]'
        ) as HTMLInputElement;

        if (titleInput) titleInput.value = template.name;
        if (durationInput) durationInput.value = template.duration.toString();

        // Trigger change events
        titleInput?.dispatchEvent(new Event("input", { bubbles: true }));
        durationInput?.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 100);
  };

  const handleTagClick = (tag: TagDto) => {
    onShowAddModal();
    // Pre-fill with tag
    setTimeout(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const titleInput = modal.querySelector(
          'input[placeholder*="Örn"]'
        ) as HTMLInputElement;
        const tagSelect = modal.querySelector("select") as HTMLSelectElement;

        if (titleInput) titleInput.value = `${tag.name} Çalışması`;
        if (tagSelect) tagSelect.value = tag.id.toString();

        titleInput?.dispatchEvent(new Event("input", { bubbles: true }));
        tagSelect?.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 100);
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
          Hızlı Plan Oluştur
        </h3>
        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">
          Yeni
        </span>
      </div>

      {/* Popular Templates */}
      <div className="space-y-2 mb-3">
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
          🔥 Popüler Şablonlar
        </h4>
        {PLAN_TEMPLATES.map((template, index) => (
          <button
            key={index}
            onClick={() => handleTemplateClick(template)}
            className="w-full p-2 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-100 text-xs">
                {template.name}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {template.duration}dk
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: template.color }}
                ></div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tag-based Quick Plans */}
      {tags && tags.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            🏷️ Etiketlerden Hızlı Plan
          </h4>
          <div className="grid grid-cols-2 gap-1">
            {tags.slice(0, 4).map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag)}
                className="p-1.5 rounded text-xs font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </button>
            ))}
          </div>
          {tags.length > 4 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              +{tags.length - 4} etiket daha
            </p>
          )}
        </div>
      )}
    </div>
  );
}
