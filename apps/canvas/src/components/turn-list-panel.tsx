"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Turn } from "../utils/turn-utils";

interface TurnListPanelProps {
  turns: Turn[];
  selectedTurnId?: string;
  onSelectTurn: (turn: Turn & { designId?: string }) => void;
  isVisible: boolean;
  onClose: () => void;
}

const TRUNCATE_LENGTH = 50;

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength);
};

export function TurnListPanel({
  turns,
  selectedTurnId,
  onSelectTurn,
  isVisible,
  onClose,
}: TurnListPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [highlightedTurnId, setHighlightedTurnId] = useState<string | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (turns.length === 0) return;
    
    const latestTurnId = turns[turns.length - 1].id;
    
    if (hasInitializedRef.current) {
      setHighlightedTurnId(latestTurnId);
      const timeout = setTimeout(() => setHighlightedTurnId(null), 2000);
      return () => clearTimeout(timeout);
    }
    hasInitializedRef.current = true;
  }, [turns]);

  if (!isVisible) {
    return (
      <div
        data-testid="turn-list-panel"
        style={{ display: "none" }}
      />
    );
  }

  return (
    <>
      <div
        data-testid="turn-list-panel"
        className="fixed bottom-[140px] left-4 z-[60] w-[240px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white/20 backdrop-blur-3xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
          <span className="text-[13px] font-medium text-gray-700">Conversation Turns</span>
          <button
            onClick={onClose}
            aria-label="Close turn list panel"
            className="flex items-center justify-center w-6 h-6 rounded-lg hover:bg-white/20 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[250px] overflow-y-auto">
          {turns.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-[13px] text-gray-400 italic">No turns yet</p>
            </div>
          ) : (
            <div className="py-1">
              {turns.map((turn) => {
                const isSelected = turn.id === selectedTurnId;
                const content = turn.userMessage.content;
                const isLong = content.length > TRUNCATE_LENGTH;
                const displayText = truncateText(content, TRUNCATE_LENGTH);
                const isHovered = hoveredId === turn.id;
                const showMarquee = isHovered && isLong;
                const isHighlighted = turn.id === highlightedTurnId;

                return (
                  <button
                    key={turn.id}
                    onClick={() => {
                      if (!isSelected) {
                        onSelectTurn(turn);
                      }
                    }}
                    onMouseEnter={() => setHoveredId(turn.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                      isSelected
                        ? "selected bg-violet-500/10 text-violet-700"
                        : "text-gray-700 hover:bg-white/20"
                    } ${showMarquee ? "marquee-scroll" : ""} ${isHighlighted ? "turn-highlight" : ""}`}
                  >
                    <span
                      className={`block ${
                        showMarquee
                          ? "animate-marquee whitespace-nowrap"
                          : "truncate"
                      }`}
                    >
                      {displayText}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 8s linear infinite;
        }
        @keyframes turn-pulse {
          0%, 100% {
            box-shadow: inset 0 0 0 2px transparent;
          }
          50% {
            box-shadow: inset 0 0 0 2px rgba(139, 92, 246, 0.5);
          }
        }
        .turn-highlight {
          animation: turn-pulse 0.6s ease-in-out 3;
        }
      `}</style>
    </>
  );
}
