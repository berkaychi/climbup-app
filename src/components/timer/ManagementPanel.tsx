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
    initialTab,
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
        "Oturum tipi oluşturulurken hata oluştu: " + (error as Error).message,
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
        "Oturum tipi güncellenirken hata oluştu: " + (error as Error).message,
      );
    }
  };

  const handleDeleteSessionType = async (id: number, name: string) => {
    if (
      window.confirm(
        `"${name}" oturum tipini silmek istediğinizden emin misiniz?`,
      )
    ) {
      try {
        await sessionTypeService.deleteSessionType(id);
        onSessionTypesUpdate();
      } catch (error) {
        console.error("Error deleting session type:", error);
        alert(
          "Oturum tipi silinirken hata oluştu: " + (error as Error).message,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      data-oid="78ect.g"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700"
        data-oid="e74spij"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800"
          data-oid="j-ewub6"
        >
          <div data-oid="qxnc4..">
            <h2
              className="text-2xl font-bold text-gray-900 dark:text-white"
              data-oid="cxfntq:"
            >
              Yönetim Paneli
            </h2>
            <p
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              data-oid="hjb0a-h"
            >
              Etiketlerinizi ve oturum tiplerinizi yönetin
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            data-oid="2e6qwjr"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="zdecpvw"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="bcjubc-"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          data-oid="ce8_iqb"
        >
          <button
            onClick={() => setActiveTab("tags")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === "tags"
                ? "text-green-600 dark:text-green-400 bg-white dark:bg-gray-900"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            data-oid="lfcqgwk"
          >
            <div
              className="flex items-center justify-center gap-3"
              data-oid="om4emj0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="o5.fyu6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  data-oid="klpk3he"
                />
              </svg>
              <span data-oid="813nfhb">Etiketler</span>
              <span
                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium"
                data-oid="dsrk1kj"
              >
                {tags?.filter((tag) => !tag.isSystemDefined)?.length || 0}
              </span>
            </div>
            {activeTab === "tags" && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"
                data-oid="w0zvb6r"
              ></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sessionTypes")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === "sessionTypes"
                ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            data-oid="vxbaag2"
          >
            <div
              className="flex items-center justify-center gap-3"
              data-oid="e_tl0bk"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="a7wn6xi"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  data-oid="mv4ubvj"
                />
              </svg>
              <span data-oid="20jp:r9">Oturum Tipleri</span>
              <span
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium"
                data-oid="b62u.zf"
              >
                {sessionTypes?.filter((st) => !st.isSystemDefined)?.length || 0}
              </span>
            </div>
            {activeTab === "sessionTypes" && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                data-oid="e:37s9t"
              ></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto max-h-[calc(85vh-200px)] bg-gray-50 dark:bg-gray-900"
          data-oid="cb1z1kc"
        >
          {activeTab === "tags" && (
            <div className="space-y-6" data-oid="0j1tq1l">
              {/* Add New Tag */}
              <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                data-oid="lp.7cox"
              >
                <div
                  className="flex items-center justify-between mb-4"
                  data-oid="fo-:sb2"
                >
                  <div className="flex items-center gap-3" data-oid="_g0d_3c">
                    <div
                      className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center"
                      data-oid=":_3z9w7"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="67qjzm8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          data-oid="bhk9g8x"
                        />
                      </svg>
                    </div>
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                      data-oid="4651q-3"
                    >
                      {editingTagId ? "Etiketi Düzenle" : "Yeni Etiket Ekle"}
                    </h3>
                  </div>
                  {(isAddingTag || editingTagId) && (
                    <button
                      onClick={resetTagForm}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      data-oid="r-wpqef"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="8ktd2pb"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                          data-oid="btxm:rf"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {isAddingTag || editingTagId ? (
                  <div className="space-y-4" data-oid="3mebjgt">
                    <div
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      data-oid="4yvp9he"
                    >
                      <div className="md:col-span-2" data-oid="_r8:p29">
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          data-oid="z_31_xd"
                        >
                          Etiket Adı
                        </label>
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="Örn: Çalışma, Proje, Önemli"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          data-oid="8e-5yxg"
                        />
                      </div>
                      <div data-oid="0zmzced">
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          data-oid="a7wztsw"
                        >
                          Renk
                        </label>
                        <div className="space-y-2" data-oid="ooest-i">
                          <input
                            type="color"
                            value={newTagColor}
                            onChange={(e) => setNewTagColor(e.target.value)}
                            className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                            data-oid="9q6b5:1"
                          />

                          {/* Live Preview */}
                          {newTagName && (
                            <div
                              className="px-3 py-1.5 rounded-full text-sm font-medium text-center transition-all duration-200 shadow-sm"
                              style={{
                                backgroundColor: newTagColor,
                                color: getTextColor(newTagColor),
                              }}
                              data-oid="xngi5ij"
                            >
                              {newTagName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div data-oid="0w4u9k6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        data-oid="vc_-pcp"
                      >
                        Açıklama (İsteğe Bağlı)
                      </label>
                      <input
                        type="text"
                        value={newTagDescription}
                        onChange={(e) => setNewTagDescription(e.target.value)}
                        placeholder="Bu etiketi ne için kullanacaksınız?"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        data-oid="cr6vbwg"
                      />
                    </div>
                    <div className="flex gap-3 pt-2" data-oid="8k72z5a">
                      <button
                        onClick={
                          editingTagId
                            ? () => handleUpdateTag(editingTagId)
                            : handleCreateTag
                        }
                        disabled={!newTagName.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                        data-oid="ai2:tmy"
                      >
                        {editingTagId ? "Güncelle" : "Oluştur"}
                      </button>
                      <button
                        onClick={resetTagForm}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                        data-oid="l0fq3rb"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingTag(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    data-oid="1fq4isu"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="8:jh58w"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        data-oid="pos2crc"
                      />
                    </svg>
                    Yeni Etiket Oluştur
                  </button>
                )}
              </div>

              {/* Existing Tags */}
              <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                data-oid="bgtsmbb"
              >
                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                  data-oid="pewprnv"
                >
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid=":3g2ixq"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      data-oid="_pt383:"
                    />
                  </svg>
                  Özel Etiketleriniz
                </h3>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  data-oid="gtmfb4r"
                >
                  {tags
                    ?.filter((tag) => !tag.isSystemDefined)
                    .map((tag) => (
                      <div
                        key={tag.id}
                        className="group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                        data-oid="r89_9r1"
                      >
                        <div
                          className="flex items-center gap-3 flex-1"
                          data-oid="zdwlxmp"
                        >
                          <div
                            className="px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            style={{
                              backgroundColor: tag.color,
                              color: getTextColor(tag.color),
                            }}
                            data-oid="2p6mys8"
                          >
                            {tag.name}
                          </div>
                          <div className="flex-1" data-oid="rmxyv:a">
                            {tag.description && (
                              <div
                                className="text-sm text-gray-500 dark:text-gray-400 truncate"
                                data-oid="1.grzdc"
                              >
                                {tag.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-oid="_9ywrlq"
                        >
                          <button
                            onClick={() => handleEditTag(tag)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                            title="Düzenle"
                            data-oid="h1o.-4s"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              data-oid="bsidrf6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                data-oid="eka7l6z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                            title="Sil"
                            data-oid="l9w:nk_"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              data-oid=":r7dpsf"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                data-oid="mppxc2d"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {tags?.filter((tag) => !tag.isSystemDefined).length === 0 && (
                  <div className="text-center py-12" data-oid="3djttza">
                    <div
                      className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
                      data-oid="ajqo-oz"
                    >
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="zldbuox"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          data-oid="ofks8rp"
                        />
                      </svg>
                    </div>
                    <h4
                      className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                      data-oid="entwo-p"
                    >
                      Henüz etiket yok
                    </h4>
                    <p
                      className="text-gray-500 dark:text-gray-400"
                      data-oid="od21qad"
                    >
                      İlk özel etiketinizi oluşturmak için yukarıdaki butonu
                      kullanın.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "sessionTypes" && (
            <div className="space-y-6" data-oid="7ceg53h">
              {/* Add New Session Type */}
              <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                data-oid="lv9g4-r"
              >
                <div
                  className="flex items-center justify-between mb-4"
                  data-oid="kh2r.4b"
                >
                  <div className="flex items-center gap-3" data-oid="w0r7m0f">
                    <div
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center"
                      data-oid="oo78y_5"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="41_f0bp"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          data-oid="lwayx3j"
                        />
                      </svg>
                    </div>
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                      data-oid="2s.ztpp"
                    >
                      {editingSessionTypeId
                        ? "Oturum Tipini Düzenle"
                        : "Yeni Oturum Tipi Ekle"}
                    </h3>
                  </div>
                  {(isAddingSessionType || editingSessionTypeId) && (
                    <button
                      onClick={resetSessionTypeForm}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      data-oid="5mgk07j"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid=":xu1wie"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                          data-oid="u56i0zu"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {isAddingSessionType || editingSessionTypeId ? (
                  <div className="space-y-4" data-oid="ksc7l02">
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      data-oid="tgu5bdk"
                    >
                      <div data-oid="6ml3mn7">
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          data-oid="zclyl04"
                        >
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
                          data-oid=".rt_g9h"
                        />
                      </div>
                      <div data-oid="2ej01uj">
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          data-oid="7w25sqf"
                        >
                          Döngü Sayısı
                        </label>
                        <input
                          type="number"
                          value={newSessionTypeNumberOfCycles}
                          onChange={(e) =>
                            setNewSessionTypeNumberOfCycles(
                              parseInt(e.target.value) || 4,
                            )
                          }
                          placeholder="4"
                          min="1"
                          max="20"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          data-oid=".rog.ox"
                        />
                      </div>
                    </div>

                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      data-oid="jq.ebqb"
                    >
                      <div data-oid="v34mnd6">
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          data-oid="to-tq0j"
                        >
                          Çalışma Süresi (Dakika)
                        </label>
                        <div className="relative" data-oid="100jomb">
                          <input
                            type="number"
                            value={newSessionTypeWorkDuration}
                            onChange={(e) =>
                              setNewSessionTypeWorkDuration(
                                parseInt(e.target.value) || 25,
                              )
                            }
                            min="1"
                            max="180"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            data-oid=".ah8muc"
                          />

                          <div
                            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                            data-oid="qcmb3i8"
                          >
                            <span
                              className="text-gray-500 text-sm"
                              data-oid="96ya:e8"
                            >
                              dk
                            </span>
                          </div>
                        </div>
                      </div>
                      <div data-oid="h8ve39b">
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                          data-oid="o895epy"
                        >
                          Mola Süresi (Dakika)
                        </label>
                        <div className="relative" data-oid="_h96cdy">
                          <input
                            type="number"
                            value={newSessionTypeBreakDuration}
                            onChange={(e) =>
                              setNewSessionTypeBreakDuration(
                                parseInt(e.target.value) || 5,
                              )
                            }
                            min="0"
                            max="60"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            data-oid="eke6rep"
                          />

                          <div
                            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                            data-oid="ic6o3hs"
                          >
                            <span
                              className="text-gray-500 text-sm"
                              data-oid="op6b4tt"
                            >
                              dk
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div data-oid="7e7k5cf">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        data-oid="rkp:fti"
                      >
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
                        data-oid="..8.mld"
                      />
                    </div>

                    <div className="flex gap-3 pt-2" data-oid="ak3w-2r">
                      <button
                        onClick={
                          editingSessionTypeId
                            ? () =>
                                handleUpdateSessionType(editingSessionTypeId)
                            : handleCreateSessionType
                        }
                        disabled={!newSessionTypeName.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                        data-oid="4_g142n"
                      >
                        {editingSessionTypeId ? "Güncelle" : "Oluştur"}
                      </button>
                      <button
                        onClick={resetSessionTypeForm}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                        data-oid=":.l0ku6"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingSessionType(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    data-oid="yk4.9d3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="68tygpu"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        data-oid="yhji1ep"
                      />
                    </svg>
                    Yeni Oturum Tipi Oluştur
                  </button>
                )}
              </div>

              {/* Existing Session Types */}
              <div
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                data-oid="sem:f2_"
              >
                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                  data-oid="s.:g9ar"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="i64r1c3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      data-oid="gy:vmn_"
                    />
                  </svg>
                  Özel Oturum Tipleriniz
                </h3>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  data-oid="j5ur5um"
                >
                  {sessionTypes
                    ?.filter((st) => !st.isSystemDefined)
                    .map((sessionType) => (
                      <div
                        key={sessionType.id}
                        className="group flex flex-col p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                        data-oid="7og34pi"
                      >
                        <div
                          className="flex items-start justify-between mb-3"
                          data-oid="v_qqx0t"
                        >
                          <div className="flex-1" data-oid="cosc1pq">
                            <div
                              className="font-semibold text-gray-900 dark:text-white text-lg"
                              data-oid="ft:72eg"
                            >
                              {sessionType.name}
                            </div>
                            <div
                              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                              data-oid="opa9gr9"
                            >
                              <div
                                className="flex items-center gap-4"
                                data-oid=":g6:a31"
                              >
                                <span
                                  className="flex items-center gap-1"
                                  data-oid="pehdgbi"
                                >
                                  <svg
                                    className="w-4 h-4 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="r::7kv6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      data-oid="ixqqksh"
                                    />
                                  </svg>
                                  {Math.floor(sessionType.workDuration / 60)}dk
                                  çalışma
                                </span>
                                <span
                                  className="flex items-center gap-1"
                                  data-oid="x967lpd"
                                >
                                  <svg
                                    className="w-4 h-4 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    data-oid="shy:077"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                      data-oid="fp.h9hk"
                                    />
                                  </svg>
                                  {Math.floor(sessionType.breakDuration / 60)}dk
                                  mola
                                </span>
                                {sessionType.numberOfCycles && (
                                  <span
                                    className="flex items-center gap-1"
                                    data-oid="t5bcs0i"
                                  >
                                    <svg
                                      className="w-4 h-4 text-purple-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      data-oid="v.sjzx:"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        data-oid="af:us58"
                                      />
                                    </svg>
                                    {sessionType.numberOfCycles} döngü
                                  </span>
                                )}
                              </div>
                            </div>
                            {sessionType.description && (
                              <div
                                className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2"
                                data-oid="-9j2c:4"
                              >
                                {sessionType.description}
                              </div>
                            )}
                          </div>
                          <div
                            className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-3"
                            data-oid="xhuhr7:"
                          >
                            <button
                              onClick={() => handleEditSessionType(sessionType)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                              title="Düzenle"
                              data-oid=":8lwgk8"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid=".4e1yfr"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  data-oid="278sssx"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSessionType(
                                  sessionType.id,
                                  sessionType.name,
                                )
                              }
                              className="p-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                              title="Sil"
                              data-oid="5:73wsn"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid=".dvv:hl"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  data-oid="6yp0ds_"
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
                  <div className="text-center py-12" data-oid="_pqb92o">
                    <div
                      className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
                      data-oid="hbu03s_"
                    >
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        data-oid="f0i_2kh"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          data-oid="jtjf5p."
                        />
                      </svg>
                    </div>
                    <h4
                      className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                      data-oid="mn4r_x:"
                    >
                      Henüz oturum tipi yok
                    </h4>
                    <p
                      className="text-gray-500 dark:text-gray-400"
                      data-oid="x3ddz65"
                    >
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
