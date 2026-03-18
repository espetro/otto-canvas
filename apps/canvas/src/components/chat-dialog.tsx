"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { AlertTriangle } from "lucide-react";
import { Turn } from "../utils/turn-utils";

interface ChatDialogProps {
  turn?: Turn;
  isVisible: boolean;
  onClose: () => void;
  isOrphaned?: boolean;
  isTurnListVisible?: boolean;
}

export function ChatDialog({ turn, isVisible, onClose, isOrphaned = false, isTurnListVisible = false }: ChatDialogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUserMessageClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUserMessageClick();
    }
  };

  const dialogHeight = isTurnListVisible ? "50vh" : "100vh";

  return (
    <div
      data-testid="chat-dialog"
      className="fixed right-0 top-0 w-[240px] bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_24px_80px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.7)] overflow-hidden z-[60] transition-all duration-300"
      style={{ 
        display: isVisible ? "block" : "none",
        height: dialogHeight,
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200/30">
        <span className="text-[13px] font-medium text-gray-700">Message</span>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-black/5 transition-all"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        {!turn ? (
          <p className="text-[13px] text-gray-400 italic text-center py-8">
            No message selected
          </p>
        ) : (
          <>
            <div
              data-testid="user-message"
              role="button"
              tabIndex={0}
              onClick={handleUserMessageClick}
              onKeyDown={handleKeyDown}
              className={`fade px-3 py-2 rounded-xl bg-gray-100/50 cursor-pointer transition-all ${
                isExpanded ? "expanded" : ""
              } ${!isExpanded ? "line-clamp-2" : ""}`}
            >
              <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1">
                You
              </div>
              <div className="text-[13px] text-gray-700">
                {turn.userMessage.content || (
                  <span className="text-gray-400 italic">Empty message</span>
                )}
              </div>
            </div>

            {isOrphaned && (
              <div className="mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-[13px] text-amber-700">
                  This design has been deleted
                </div>
              </div>
            )}

            {turn.assistantMessage && (
              <div
                data-testid="assistant-message"
                className="mt-3 px-3 py-2 rounded-xl"
              >
                <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1">
                  Assistant
                </div>
                <div className="text-[13px] text-gray-700 prose prose-sm prose-gray max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {turn.assistantMessage.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
