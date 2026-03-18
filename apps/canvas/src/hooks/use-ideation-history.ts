"use client";

import { useState, useCallback, useEffect } from "react";

export interface IdeationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface UseIdeationHistoryReturn {
  messages: IdeationMessage[];
  addMessage: (message: IdeationMessage) => void;
  clearMessages: () => void;
  lastAssistantMessage: IdeationMessage | undefined;
}

const MESSAGE_LIMIT = 20;

export function useIdeationHistory(
  projectId: string | null,
): UseIdeationHistoryReturn {
  const [messages, setMessagesRaw] = useState<IdeationMessage[]>([]);
  const storageKey = projectId
    ? `otto-ideation-history-${projectId}`
    : "otto-ideation-history-default";

  // Load from localStorage on mount or when projectId changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as IdeationMessage[];
        setMessagesRaw(Array.isArray(parsed) ? parsed : []);
      } else {
        setMessagesRaw([]);
      }
    } catch {
      // Invalid JSON: reset to empty array
      setMessagesRaw([]);
    }
  }, [projectId, storageKey]);

  // Persist messages to localStorage
  const persistMessages = useCallback(
    (newMessages: IdeationMessage[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newMessages));
      } catch (err) {
        // Quota exceeded: try removing oldest 5 messages and retry
        if (
          err instanceof DOMException &&
          err.name === "QuotaExceededError"
        ) {
          try {
            const trimmed = newMessages.slice(5);
            localStorage.setItem(storageKey, JSON.stringify(trimmed));
          } catch {
            // Still fails: silently drop (don't persist)
          }
        }
      }
    },
    [storageKey],
  );

  // Add a message with 20-message limit
  const addMessage = useCallback(
    (message: IdeationMessage) => {
      setMessagesRaw((prev) => {
        let next = [...prev, message];
        // Enforce 20-message limit: drop oldest when adding 21st
        if (next.length > MESSAGE_LIMIT) {
          next = next.slice(next.length - MESSAGE_LIMIT);
        }
        persistMessages(next);
        return next;
      });
    },
    [persistMessages],
  );

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessagesRaw([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  // Compute lastAssistantMessage
  const lastAssistantMessage = messages
    .slice()
    .reverse()
    .find((msg) => msg.role === "assistant");

  return {
    messages,
    addMessage,
    clearMessages,
    lastAssistantMessage,
  };
}
