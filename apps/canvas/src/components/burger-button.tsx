"use client";

interface BurgerButtonProps {
  onClick: () => void;
}

export function BurgerButton({ onClick }: BurgerButtonProps) {
  return (
    <button
      onClick={onClick}
      title="Open session manager"
      className="fixed top-4 left-4 z-50 w-10 h-10 rounded-[14px] flex items-center justify-center bg-white/20 backdrop-blur-3xl border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] text-gray-600 hover:text-gray-900 hover:bg-white/30 transition-all duration-200"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    </button>
  );
}
