"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Logs, ChevronUp, MessageSquareText } from "lucide-react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  designId?: string;
}

interface AgentChatPanelProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  isVisible: boolean;
  onToggleVisible: () => void;
  onToggleTurnList?: () => void;
  isTurnListVisible?: boolean;
}

export function AgentChatPanel({
  messages,
  isLoading = false,
  isVisible,
  onToggleVisible,
  onToggleTurnList,
  isTurnListVisible = false,
}: AgentChatPanelProps) {
  const [showHistory, setShowHistory] = useState(false);

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  return (
    <>
      <button
        onClick={onToggleVisible}
        className="fixed bottom-10 left-4 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-[20px] text-[13px] font-medium bg-white/20 backdrop-blur-3xl border border-white/30 text-gray-700 hover:bg-white/30 transition-all shadow-[0_8px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <Logs className="w-4 h-4" />
        <span>Agent log</span>
        <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${isVisible ? '' : 'rotate-180'}`} />
      </button>

      <button
        onClick={onToggleTurnList}
        className="fixed bottom-[52px] left-4 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-[20px] text-[13px] font-medium bg-white/20 backdrop-blur-3xl border border-white/30 text-gray-700 hover:bg-white/30 transition-all shadow-[0_8px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <MessageSquareText className="w-4 h-4" />
        <span>View conversation</span>
      </button>

      {isVisible && (
        <div className="fixed bottom-[100px] left-4 z-[60] w-[240px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white/20 backdrop-blur-3xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/20">
            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-700 text-[11px] font-medium border border-violet-300/30">
              ◈ Ideate
            </span>
            {isLoading && (
              <svg
                className="w-4 h-4 animate-spin text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  opacity="0.2"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>

          <div className="max-h-[250px] overflow-y-auto p-4">
            {lastAssistantMessage ? (
              <div className="prose prose-sm prose-gray max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {lastAssistantMessage.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-[13px] text-gray-400 italic">
                No agent response yet
              </p>
            )}
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full px-4 py-2 text-[12px] text-gray-500 hover:text-gray-700 hover:bg-white/10 transition-colors border-t border-white/20"
            >
              {showHistory ? "Hide agent log ∧" : "View agent log ∨"}
            </button>
          )}

          {showHistory && (
            <div className="max-h-[200px] overflow-y-auto border-t border-white/20">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 border-b border-white/10 last:border-b-0 ${
                    message.role === "user"
                      ? "bg-white/5"
                      : "bg-transparent"
                  }`}
                >
                  <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-1">
                    {message.role === "user" ? "You" : "Agent"}
                  </div>
                  <div className="text-[13px] text-gray-700 prose prose-sm prose-gray max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
