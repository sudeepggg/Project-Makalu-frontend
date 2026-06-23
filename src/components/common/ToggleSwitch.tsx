// components/common/ToggleSwitch.tsx
import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  const isSmall = size === "sm";

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex shrink-0 items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${isSmall ? "h-4 w-7" : "h-5 w-9"}
        ${checked ? "bg-green-500 focus-visible:ring-green-400" : "bg-surface-300 focus-visible:ring-ink-faint"}
      `}
    >
      <span
        className={`
          inline-block rounded-full bg-white shadow-sm
          transition-transform duration-200 ease-in-out
          ${isSmall ? "h-3 w-3" : "h-3.5 w-3.5"}
          ${checked
            ? isSmall ? "translate-x-3.5" : "translate-x-4.5"
            : "translate-x-0.5"
          }
        `}
      />
    </button>
  );
};

export default ToggleSwitch;