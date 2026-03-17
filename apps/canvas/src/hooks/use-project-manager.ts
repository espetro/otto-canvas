import { useCallback, useEffect, useState } from "react";

export interface Project {
  id: string;
  name: string;
  lastUpdated: number;
  createdAt: number;
}

const PROJECTS_INDEX_KEY = "otto-projects-index";
const CURRENT_PROJECT_KEY = "otto-current-project-id";
const LEGACY_SESSION_KEY = "otto-canvas-session";
const MIGRATION_FLAG_KEY = "otto-projects-migrated";

export function useProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectIdState] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  const persistProjects = useCallback((newProjects: Project[]) => {
    try {
      localStorage.setItem(PROJECTS_INDEX_KEY, JSON.stringify(newProjects));
    } catch (err) {
      console.warn("[useProjectManager] Failed to save projects index:", err);
    }
  }, []);

  const persistCurrentProjectId = useCallback((id: string) => {
    try {
      localStorage.setItem(CURRENT_PROJECT_KEY, id);
    } catch (err) {
      console.warn("[useProjectManager] Failed to save current project ID:", err);
    }
  }, []);

  useEffect(() => {
    try {
      const rawProjects = localStorage.getItem(PROJECTS_INDEX_KEY);
      const rawCurrentProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);

      if (rawProjects) {
        const parsed = JSON.parse(rawProjects) as Project[];
        const sorted = parsed.sort((a, b) => b.lastUpdated - a.lastUpdated);
        setProjects(sorted);
      }

      if (rawCurrentProjectId) {
        setCurrentProjectIdState(rawCurrentProjectId);
      }
    } catch (err) {
      console.warn("[useProjectManager] Failed to load projects:", err);
    }

    setLoaded(true);
  }, []);

  const migrateIfNeeded = useCallback(() => {
    try {
      const alreadyMigrated = localStorage.getItem(MIGRATION_FLAG_KEY);
      if (alreadyMigrated === "true") {
        return;
      }

      const legacySessionRaw = localStorage.getItem(LEGACY_SESSION_KEY);
      const newProjects: Project[] = [];

      if (legacySessionRaw) {
        try {
          const legacySession = JSON.parse(legacySessionRaw);
          const migratedProject: Project = {
            id: "project-migrated",
            name: "My Canvas",
            lastUpdated: Date.now(),
            createdAt: Date.now(),
          };
          newProjects.push(migratedProject);
        } catch {
        }
      }

      if (newProjects.length > 0) {
        persistProjects(newProjects);
        setProjects(newProjects);
        persistCurrentProjectId("project-migrated");
        setCurrentProjectIdState("project-migrated");
      }

      localStorage.setItem(MIGRATION_FLAG_KEY, "true");
    } catch (err) {
      console.warn("[useProjectManager] Migration failed:", err);
    }
  }, [persistProjects, persistCurrentProjectId]);

  useEffect(() => {
    migrateIfNeeded();
  }, [migrateIfNeeded]);

  const createProject = useCallback(
    (firstPrompt: string): Project => {
      let name = firstPrompt.trim();
      name = name.slice(0, 40);
      name = name.trim();
      if (name.length < 10) {
        name = "New Project";
      }

      const existingNames = new Set(projects.map((p) => p.name));
      let finalName = name;
      let suffix = 2;
      while (existingNames.has(finalName)) {
        finalName = `${name} (${suffix})`;
        suffix++;
      }

      const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
      const now = Date.now();

      const newProject: Project = {
        id,
        name: finalName,
        lastUpdated: now,
        createdAt: now,
      };

      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      persistProjects(updatedProjects);

      setCurrentProjectIdState(id);
      persistCurrentProjectId(id);

      return newProject;
    },
    [projects, persistProjects, persistCurrentProjectId],
  );

  const switchProject = useCallback(
    (id: string) => {
      if (id === currentProjectId) return;

      const updatedProjects = projects.map((p) => {
        if (p.id === currentProjectId) {
          return { ...p, lastUpdated: Date.now() };
        }
        return p;
      });

      const sortedProjects = updatedProjects.sort((a, b) => b.lastUpdated - a.lastUpdated);
      setProjects(sortedProjects);
      persistProjects(sortedProjects);

      setCurrentProjectIdState(id);
      persistCurrentProjectId(id);
    },
    [currentProjectId, projects, persistProjects, persistCurrentProjectId],
  );

  const renameProject = useCallback(
    (id: string, newName: string) => {
      const trimmedName = newName.trim();
      if (!trimmedName) return;

      const updatedProjects = projects.map((p) => {
        if (p.id === id) {
          return { ...p, name: trimmedName, lastUpdated: Date.now() };
        }
        return p;
      });

      setProjects(updatedProjects);
      persistProjects(updatedProjects);
    },
    [projects, persistProjects],
  );

  const updateCurrentProjectTimestamp = useCallback(() => {
    if (!currentProjectId) return;

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProjectId) {
        return { ...p, lastUpdated: Date.now() };
      }
      return p;
    });

    setProjects(updatedProjects);
    persistProjects(updatedProjects);
  }, [currentProjectId, projects, persistProjects]);

  const currentProject = projects.find((p) => p.id === currentProjectId);

  return {
    projects,
    currentProjectId,
    currentProject,
    createProject,
    switchProject,
    renameProject,
    updateCurrentProjectTimestamp,
    loaded,
  };
}
