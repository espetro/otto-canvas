"use client";

import { useState, useCallback, useEffect } from "react";

export interface Settings {
  apiKey: string;
  geminiKey: string;
  unsplashKey: string;
  openaiKey: string;
  anthropicApiUrl: string;
  model: string;
  systemPrompt: string;
  systemPromptPreset: string;
  conceptCount: number;
  quickMode: boolean;
  showZoomControls: boolean;
}

export interface ModelInfo {
  id: string;
  displayName: string;
  description: string;
}

const STORAGE_KEY = "otto-settings";
const CACHED_MODELS_KEY = "otto-cached-models";
const CACHED_MODELS_TIMESTAMP_KEY = "otto-cached-models-timestamp";
const MODELS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_MODEL = "claude-opus-4-6";

// Fallback hardcoded models (used when API fetch fails or no key is set)
export const FALLBACK_MODELS: ModelInfo[] = [
  { id: "claude-opus-4-6", displayName: "Opus 4.6", description: "Best quality, slowest" },
  { id: "claude-opus-4-5-20250918", displayName: "Opus 4.5", description: "Creative + powerful" },
  { id: "claude-sonnet-4-5", displayName: "Sonnet 4.5", description: "Fast + great" },
  { id: "claude-opus-4", displayName: "Opus 4", description: "High quality, slower" },
  { id: "claude-sonnet-4", displayName: "Sonnet 4", description: "Fast, reliable" },
];

// Keep MODELS export for backward compatibility
export const MODELS = [
  { id: "claude-opus-4-6", label: "Opus 4.6", desc: "Best quality, slowest" },
  { id: "claude-opus-4-5-20250918", label: "Opus 4.5", desc: "Creative + powerful" },
  { id: "claude-sonnet-4-5", label: "Sonnet 4.5", desc: "Fast + great" },
  { id: "claude-opus-4", label: "Opus 4", desc: "High quality, slower" },
  { id: "claude-sonnet-4", label: "Sonnet 4", desc: "Fast, reliable" },
] as const;

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>({
    apiKey: "",
    geminiKey: "",
    unsplashKey: "",
    openaiKey: "",
    anthropicApiUrl: "",
    model: DEFAULT_MODEL,

    systemPrompt: "",
    systemPromptPreset: "custom",
    conceptCount: 4,
    quickMode: false,
    showZoomControls: false,
  });
  const [loaded, setLoaded] = useState(false);
  const [cachedModels, setCachedModels] = useState<ModelInfo[]>(FALLBACK_MODELS);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsCacheTime, setModelsCacheTime] = useState<number | null>(null);
  // Track last fetched credentials to detect changes
  const [lastFetchedKey, setLastFetchedKey] = useState<string>("");
  const [lastFetchedUrl, setLastFetchedUrl] = useState<string>("");
  // Load settings from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettingsState({
          apiKey: parsed.apiKey || "",
          geminiKey: parsed.geminiKey || "",
          unsplashKey: parsed.unsplashKey || "",
          openaiKey: parsed.openaiKey || "",
          anthropicApiUrl: parsed.anthropicApiUrl || "",
          model: parsed.model || DEFAULT_MODEL,

          systemPrompt: parsed.systemPrompt || "",
          systemPromptPreset: parsed.systemPromptPreset || "custom",
          conceptCount: parsed.conceptCount || 4,
          quickMode: parsed.quickMode ?? false,
          showZoomControls: parsed.showZoomControls ?? false,
        });
      }
      // Load cached models from localStorage
      const cachedRaw = localStorage.getItem(CACHED_MODELS_KEY);
      const cachedTimeRaw = localStorage.getItem(CACHED_MODELS_TIMESTAMP_KEY);
      if (cachedRaw) {
        setCachedModels(JSON.parse(cachedRaw));
      }
      if (cachedTimeRaw) {
        setModelsCacheTime(parseInt(cachedTimeRaw, 10));
      }
    } catch {}
    setLoaded(true);
  }, []);

  const setSettings = useCallback((update: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...update };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Fetch models from API when API key or URL changes
  useEffect(() => {
    if (!loaded) return;
    if (!settings.apiKey) {
      // No API key, use fallback models
      setCachedModels(FALLBACK_MODELS);
      setLastFetchedKey("");
      setLastFetchedUrl("");
      return;
    }

    // Check if credentials changed - if so, clear cache and refetch
    const credentialsChanged = 
      settings.apiKey !== lastFetchedKey || 
      settings.anthropicApiUrl !== lastFetchedUrl;
    
    // Check if cache is still valid (only if credentials haven't changed)
    const now = Date.now();
    if (!credentialsChanged && modelsCacheTime && now - modelsCacheTime < MODELS_CACHE_DURATION) {
      // Cache is still valid and credentials unchanged, don't refetch
      return;
    }

    // Fetch models from API
    const fetchModels = async () => {
      setIsLoadingModels(true);
      try {
        const response = await fetch("/api/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: settings.apiKey,
            anthropicApiUrl: settings.anthropicApiUrl || undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.models && data.models.length > 0) {
            setCachedModels(data.models);
            setModelsCacheTime(now);
            setLastFetchedKey(settings.apiKey);
            setLastFetchedUrl(settings.anthropicApiUrl);
            // Save to localStorage
            try {
              localStorage.setItem(CACHED_MODELS_KEY, JSON.stringify(data.models));
              localStorage.setItem(CACHED_MODELS_TIMESTAMP_KEY, now.toString());
            } catch {}
          }
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
        // Keep existing cached models or fallbacks on error
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, [loaded, settings.apiKey, settings.anthropicApiUrl]);

  const isOwnKey = !!settings.apiKey;
  const hasGeminiKey = !!settings.geminiKey;

  // Build available models map from cached models
  const availableModels: Record<string, boolean> = {};
  for (const m of cachedModels) {
    availableModels[m.id] = true;
  }

  return { 
    settings, 
    setSettings, 
    isOwnKey, 
    hasGeminiKey, 
    loaded, 
    availableModels, 
    isProbing: isLoadingModels,
    cachedModels 
  };
}
