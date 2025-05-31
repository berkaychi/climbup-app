"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { TagDto } from "../../hooks/useTags";
import { SessionTypeResponseDto } from "../../hooks/useSessionTypes";
import {
  TagService,
  CreateTagData,
  UpdateTagData,
} from "../../services/tagService";
import {
  SessionTypeService,
  CreateSessionTypeData,
  UpdateSessionTypeData,
} from "../../services/sessionTypeService";

// Automatic text color algorithm based on background color contrast
const getTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance using WCAG formula
  const getLuminance = (rgb: number) => {
    const sRGB = rgb / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const luminance =
    0.2126 * getLuminance(r) +
    0.7152 * getLuminance(g) +
    0.0722 * getLuminance(b);

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

interface ManagementPanelProps {
  tags: TagDto[] | null;
  sessionTypes: SessionTypeResponseDto[] | null;
  onTagsUpdate: () => void;
  onSessionTypesUpdate: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "tags" | "sessionTypes";
  editingTag?: TagDto | null;
  editingSessionType?: SessionTypeResponseDto | null;
}

const ManagementPanel = ({
  tags,
  sessionTypes,
  onTagsUpdate,
  onSessionTypesUpdate,
  isOpen,
  onClose,
  initialTab = "tags",
  editingTag = null,
  editingSessionType = null,
}: ManagementPanelProps) => {
  const authContext = useAuth();
  const [activeTab, setActiveTab] = useState<"tags" | "sessionTypes">(
    initialTab
  );

  // Update active tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Reset all forms when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetTagForm();
      resetSessionTypeForm();
    }
  }, [isOpen]);

  // Handle editing tag when passed as prop
  useEffect(() => {
    if (editingTag && isOpen) {
      handleEditTag(editingTag);
    }
  }, [editingTag, isOpen]);

  // Handle editing session type when passed as prop
  useEffect(() => {
    if (editingSessionType && isOpen) {
      handleEditSessionType(editingSessionType);
    }
  }, [editingSessionType, isOpen]);

  // Tag management state
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [newTagColor, setNewTagColor] = useState("#465956");

  // Session Type management state
  const [isAddingSessionType, setIsAddingSessionType] = useState(false);
  const [editingSessionTypeId, setEditingSessionTypeId] = useState<
    number | null
  >(null);
  const [newSessionTypeName, setNewSessionTypeName] = useState("");
  const [newSessionTypeDescription, setNewSessionTypeDescription] =
    useState("");
  const [newSessionTypeWorkDuration, setNewSessionTypeWorkDuration] =
    useState(25);
  const [newSessionTypeBreakDuration, setNewSessionTypeBreakDuration] =
    useState(5);
  const [newSessionTypeNumberOfCycles, setNewSessionTypeNumberOfCycles] =
    useState(4);

  const tagService = new TagService(authContext);
  const sessionTypeService = new SessionTypeService(authContext);

  const resetTagForm = () => {
    setNewTagName("");
    setNewTagDescription("");
    setNewTagColor("#465956");
    setIsAddingTag(false);
    setEditingTagId(null);
  };

  const resetSessionTypeForm = () => {
    setNewSessionTypeName("");
    setNewSessionTypeDescription("");
    setNewSessionTypeWorkDuration(25);
    setNewSessionTypeBreakDuration(5);
    setNewSessionTypeNumberOfCycles(4);
    setIsAddingSessionType(false);
    setEditingSessionTypeId(null);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const tagData: CreateTagData = {
        name: newTagName.trim(),
        description: newTagDescription.trim() || undefined,
        color: newTagColor,
      };

      await tagService.createTag(tagData);
      resetTagForm();
      onTagsUpdate();
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Tag oluşturulurken hata oluştu: " + (error as Error).message);
    }
  };

  const handleUpdateTag = async (id: number) => {
    if (!newTagName.trim()) return;

    try {
      const updateData: UpdateTagData = {
        name: newTagName.trim(),
        description: newTagDescription.trim() || undefined,
        color: newTagColor,
      };

      await tagService.updateTag(id, updateData);
      resetTagForm();
      onTagsUpdate();
    } catch (error) {
      console.error("Error updating tag:", error);
      alert("Tag güncellenirken hata oluştu: " + (error as Error).message);
    }
  };

  const handleDeleteTag = async (id: number, name: string) => {
    if (
      window.confirm(`"${name}" etiketini silmek istediğinizden emin misiniz?`)
    ) {
      try {
        await tagService.deleteTag(id);
        onTagsUpdate();
      } catch (error) {
        console.error("Error deleting tag:", error);
        alert("Tag silinirken hata oluştu: " + (error as Error).message);
      }
    }
  };

  const handleEditTag = (tag: TagDto) => {
    setNewTagName(tag.name);
    setNewTagDescription(tag.description || "");
    setNewTagColor(tag.color);
    setEditingTagId(tag.id);
    setIsAddingTag(false);
  };

  const handleCreateSessionType = async () => {
    if (!newSessionTypeName.trim()) return;

    try {
      const sessionTypeData: CreateSessionTypeData = {
        name: newSessionTypeName.trim(),
        description: newSessionTypeDescription.trim() || undefined,
        workDuration: newSessionTypeWorkDuration * 60, // Convert to seconds
        breakDuration: newSessionTypeBreakDuration * 60, // Convert to seconds
        numberOfCycles: newSessionTypeNumberOfCycles,
      };

      await sessionTypeService.createSessionType(sessionTypeData);
      resetSessionTypeForm();
      onSessionTypesUpdate();
    } catch (error) {
      console.error("Error creating session type:", error);
      alert(
        "Oturum tipi oluşturulurken hata oluştu: " + (error as Error).message
      );
    }
  };

  const handleUpdateSessionType = async (id: number) => {
    if (!newSessionTypeName.trim()) return;

    try {
      const updateData: UpdateSessionTypeData = {
        name: newSessionTypeName.trim(),
        description: newSessionTypeDescription.trim() || undefined,
        workDuration: newSessionTypeWorkDuration * 60, // Convert to seconds
        breakDuration: newSessionTypeBreakDuration * 60, // Convert to seconds
        numberOfCycles: newSessionTypeNumberOfCycles,
      };

      await sessionTypeService.updateSessionType(id, updateData);
      resetSessionTypeForm();
      onSessionTypesUpdate();
    } catch (error) {
      console.error("Error updating session type:", error);
      alert(
        "Oturum tipi güncellenirken hata oluştu: " + (error as Error).message
      );
    }
  };

  const handleDeleteSessionType = async (id: number, name: string) => {
    if (
      window.confirm(
        `"${name}" oturum tipini silmek istediğinizden emin misiniz?`
      )
    ) {
      try {
        await sessionTypeService.deleteSessionType(id);
        onSessionTypesUpdate();
      } catch (error) {
        console.error("Error deleting session type:", error);
        alert(
          "Oturum tipi silinirken hata oluştu: " + (error as Error).message
        );
      }
    }
  };

  const handleEditSessionType = (sessionType: SessionTypeResponseDto) => {
    setNewSessionTypeName(sessionType.name);
    setNewSessionTypeDescription(sessionType.description || "");
    setNewSessionTypeWorkDuration(Math.floor(sessionType.workDuration / 60));
    setNewSessionTypeBreakDuration(Math.floor(sessionType.breakDuration / 60));
    setNewSessionTypeNumberOfCycles(sessionType.numberOfCycles || 4);
    setEditingSessionTypeId(sessionType.id);
    setIsAddingSessionType(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Yönetim Paneli
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Etiketlerinizi ve oturum tiplerinizi yönetin
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab("tags")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === "tags"
                ? "text-green-600 dark:text-green-400 bg-white dark:bg-gray-900"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>Etiketler</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                {tags?.filter((tag) => !tag.isSystemDefined)?.length || 0}
              </span>
            </div>
            {activeTab === "tags" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sessionTypes")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === "sessionTypes"
                ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Oturum Tipleri</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                {sessionTypes?.filter((st) => !st.isSystemDefined)?.length || 0}
              </span>
            </div>
            {activeTab === "sessionTypes" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)] bg-gray-50 dark:bg-gray-900">
          {activeTab === "tags" && (
            <div className="space-y-6">
              {/* Add New Tag */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editingTagId ? "Etiketi Düzenle" : "Yeni Etiket Ekle"}
                    </h3>
                  </div>
                  {(isAddingTag || editingTagId) && (
                    <button
                      onClick={resetTagForm}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {isAddingTag || editingTagId ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Etiket Adı
                        </label>
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="Örn: Çalışma, Proje, Önemli"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Renk
                        </label>
                        <div className="space-y-2">
                          <input
                            type="color"
                            value={newTagColor}
                            onChange={(e) => setNewTagColor(e.target.value)}
                            className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                          />
                          {/* Live Preview */}
                          {newTagName && (
                            <div
                              className="px-3 py-1.5 rounded-full text-sm font-medium text-center transition-all duration-200 shadow-sm"
                              style={{
                                backgroundColor: newTagColor,
                                color: getTextColor(newTagColor),
                              }}
                            >
                              {newTagName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Açıklama (İsteğe Bağlı)
                      </label>
                      <input
                        type="text"
                        value={newTagDescription}
                        onChange={(e) => setNewTagDescription(e.target.value)}
                        placeholder="Bu etiketi ne için kullanacaksınız?"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={
                          editingTagId
                            ? () => handleUpdateTag(editingTagId)
                            : handleCreateTag
                        }
                        disabled={!newTagName.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                      >
                        {editingTagId ? "Güncelle" : "Oluştur"}
                      </button>
                      <button
                        onClick={resetTagForm}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingTag(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Yeni Etiket Oluştur
                  </button>
                )}
              </div>

              {/* Existing Tags */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Özel Etiketleriniz
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tags
                    ?.filter((tag) => !tag.isSystemDefined)
                    .map((tag) => (
                      <div
                        key={tag.id}
                        className="group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            style={{
                              backgroundColor: tag.color,
                              color: getTextColor(tag.color),
                            }}
                          >
                            {tag.name}
                          </div>
                          <div className="flex-1">
                            {tag.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {tag.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditTag(tag)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                            title="Düzenle"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                            title="Sil"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {tags?.filter((tag) => !tag.isSystemDefined).length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Henüz etiket yok
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      İlk özel etiketinizi oluşturmak için yukarıdaki butonu
                      kullanın.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "sessionTypes" && (
            <div className="space-y-6">
              {/* Add New Session Type */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editingSessionTypeId
                        ? "Oturum Tipini Düzenle"
                        : "Yeni Oturum Tipi Ekle"}
                    </h3>
                  </div>
                  {(isAddingSessionType || editingSessionTypeId) && (
                    <button
                      onClick={resetSessionTypeForm}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {isAddingSessionType || editingSessionTypeId ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Oturum Tipi Adı
                        </label>
                        <input
                          type="text"
                          value={newSessionTypeName}
                          onChange={(e) =>
                            setNewSessionTypeName(e.target.value)
                          }
                          placeholder="Örn: Pomodoro, Deep Work, Sprint"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Döngü Sayısı
                        </label>
                        <input
                          type="number"
                          value={newSessionTypeNumberOfCycles}
                          onChange={(e) =>
                            setNewSessionTypeNumberOfCycles(
                              parseInt(e.target.value) || 4
                            )
                          }
                          placeholder="4"
                          min="1"
                          max="20"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Çalışma Süresi (Dakika)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={newSessionTypeWorkDuration}
                            onChange={(e) =>
                              setNewSessionTypeWorkDuration(
                                parseInt(e.target.value) || 25
                              )
                            }
                            min="1"
                            max="180"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500 text-sm">dk</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mola Süresi (Dakika)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={newSessionTypeBreakDuration}
                            onChange={(e) =>
                              setNewSessionTypeBreakDuration(
                                parseInt(e.target.value) || 5
                              )
                            }
                            min="0"
                            max="60"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500 text-sm">dk</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Açıklama (İsteğe Bağlı)
                      </label>
                      <input
                        type="text"
                        value={newSessionTypeDescription}
                        onChange={(e) =>
                          setNewSessionTypeDescription(e.target.value)
                        }
                        placeholder="Bu oturum tipi için kısa bir açıklama"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={
                          editingSessionTypeId
                            ? () =>
                                handleUpdateSessionType(editingSessionTypeId)
                            : handleCreateSessionType
                        }
                        disabled={!newSessionTypeName.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                      >
                        {editingSessionTypeId ? "Güncelle" : "Oluştur"}
                      </button>
                      <button
                        onClick={resetSessionTypeForm}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingSessionType(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Yeni Oturum Tipi Oluştur
                  </button>
                )}
              </div>

              {/* Existing Session Types */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Özel Oturum Tipleriniz
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionTypes
                    ?.filter((st) => !st.isSystemDefined)
                    .map((sessionType) => (
                      <div
                        key={sessionType.id}
                        className="group flex flex-col p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white text-lg">
                              {sessionType.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {Math.floor(sessionType.workDuration / 60)}dk
                                  çalışma
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                  </svg>
                                  {Math.floor(sessionType.breakDuration / 60)}dk
                                  mola
                                </span>
                                {sessionType.numberOfCycles && (
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4 text-purple-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                      />
                                    </svg>
                                    {sessionType.numberOfCycles} döngü
                                  </span>
                                )}
                              </div>
                            </div>
                            {sessionType.description && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                {sessionType.description}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                            <button
                              onClick={() => handleEditSessionType(sessionType)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                              title="Düzenle"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSessionType(
                                  sessionType.id,
                                  sessionType.name
                                )
                              }
                              className="p-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                              title="Sil"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {sessionTypes?.filter((st) => !st.isSystemDefined).length ===
                  0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Henüz oturum tipi yok
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      İlk özel oturum tipinizi oluşturmak için yukarıdaki butonu
                      kullanın.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementPanel;
