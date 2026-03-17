"use client";

import { useState, useRef, useEffect } from "react";
import type { Project } from "@/hooks/use-project-manager";
import type { GenerationGroup, CanvasImage } from "@otto/types";

interface SessionSidebarProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string;
  currentProject: Project | null;
  groups: GenerationGroup[];
  canvasImages: CanvasImage[];
  onSwitchProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onCreateNewProject: () => void;
}

// Relative time helper (no library)
function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function SessionSidebar({
  open,
  onClose,
  projects,
  currentProjectId,
  currentProject,
  groups,
  canvasImages,
  onSwitchProject,
  onRenameProject,
  onCreateNewProject,
}: SessionSidebarProps) {
  const [view, setView] = useState<"current" | "projects">("current");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProjectId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingProjectId]);

  const handleStartRename = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingName(project.name);
  };

  const handleSaveRename = () => {
    if (editingProjectId) {
      const trimmedName = editingName.trim();
      if (trimmedName) {
        onRenameProject(editingProjectId, trimmedName);
      }
    }
    setEditingProjectId(null);
    setEditingName("");
  };

  const handleCancelRename = () => {
    setEditingProjectId(null);
    setEditingName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelRename();
    }
  };

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );

  const BackIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );

  const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );

  const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  const ImageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );

  const LayersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );

  return (
    <div
      className={`fixed top-3 left-3 bottom-3 w-[280px] max-w-[85vw] z-50 bg-white/20 backdrop-blur-3xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] rounded-[20px] flex flex-col overflow-hidden transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        open ? "translate-x-0" : "-translate-x-[120%]"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/30 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {view === "projects" ? (
            <>
              <button
                onClick={() => setView("current")}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-black/5 transition-all shrink-0"
              >
                <span className="w-4 h-4 block"><BackIcon /></span>
              </button>
              <span className="text-[15px] font-semibold text-gray-800 truncate">All Projects</span>
            </>
          ) : (
            <>
              <span className="w-4 h-4 text-gray-500 block shrink-0"><LayersIcon /></span>
              <span className="text-[15px] font-semibold text-gray-800 truncate">
                {currentProject?.name || "Canvas"}
              </span>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-black/5 transition-all shrink-0"
        >
          <span className="w-4 h-4 block"><CloseIcon /></span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === "current" ? (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setView("projects")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/40 hover:bg-white/60 border border-white/50 hover:border-white/70 transition-all text-left group"
            >
              <span className="w-5 h-5 text-gray-500 group-hover:text-gray-700 shrink-0"><GridIcon /></span>
              <span className="text-[13px] font-medium text-gray-700">All Projects</span>
              <span className="ml-auto text-[11px] text-gray-400">{projects.length}</span>
            </button>

            <div>
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">
                Artifacts
              </h3>
              {groups.length === 0 ? (
                <div className="text-[13px] text-gray-400 px-4 py-6 text-center">
                  No artifacts yet
                </div>
              ) : (
                <div className="space-y-1.5">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="group/item flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/30 hover:bg-white/50 border border-transparent hover:border-white/50 transition-all cursor-pointer"
                    >
                      <span className="w-4 h-4 text-gray-400 shrink-0"><LayersIcon /></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-gray-700 truncate">
                          {group.prompt.slice(0, 50)}
                          {group.prompt.length > 50 ? "..." : ""}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {group.iterations.length} iteration{group.iterations.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {getRelativeTime(group.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">
                Media
              </h3>
              {canvasImages.length === 0 ? (
                <div className="text-[13px] text-gray-400 px-4 py-6 text-center">
                  No media uploaded
                </div>
              ) : (
                <div className="space-y-1.5">
                  {canvasImages.map((image) => (
                    <div
                      key={image.id}
                      className="group/item flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/30 hover:bg-white/50 border border-transparent hover:border-white/50 transition-all cursor-pointer"
                    >
                      <span className="w-4 h-4 text-gray-400 shrink-0"><ImageIcon /></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-gray-700 truncate">
                          {image.name}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {image.width} × {image.height}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-1.5">
            <button
              onClick={() => {
                onCreateNewProject();
                setView("current");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 transition-all text-left"
            >
              <span className="w-5 h-5 text-blue-500 shrink-0"><PlusIcon /></span>
              <span className="text-[13px] font-medium text-blue-600">New Project</span>
            </button>

            {projects.map((project) => {
              const isActive = project.id === currentProjectId;
              const isEditing = project.id === editingProjectId;

              return (
                <div
                  key={project.id}
                  className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-500/15 border border-blue-500/30"
                      : "bg-white/30 hover:bg-white/50 border border-transparent hover:border-white/50"
                  }`}
                  onClick={() => {
                    if (!isEditing) {
                      onSwitchProject(project.id);
                      setView("current");
                    }
                  }}
                >
                  <span className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                    <LayersIcon />
                  </span>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveRename}
                        className="w-full text-[13px] font-medium text-gray-800 bg-white/80 px-2 py-0.5 rounded border border-blue-300 outline-none focus:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div
                        className="text-[13px] font-medium text-gray-700 truncate cursor-text"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(project);
                        }}
                      >
                        {project.name}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-400">
                      {getRelativeTime(project.lastUpdated)}
                    </div>
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <div className="text-[13px] text-gray-400 px-4 py-8 text-center">
                No projects yet. Create one to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
