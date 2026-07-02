import React from "react";

interface TwinkleTextProps {
  text: string;
  className?: string;
  glowColor?: string; // e.g. "rgba(251, 191, 36, 0.4)"
}

export function TwinkleText({ text, className = "", glowColor = "rgba(251, 191, 36, 0.4)" }: TwinkleTextProps) {
  return (
    <span className={`inline-flex flex-wrap justify-center ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="animate-twinkle inline-block"
          style={{
            animationDelay: `${index * 0.12}s`,
            animationDuration: `${1.8 + (index % 3) * 0.4}s`,
            textShadow: `0 0 8px ${glowColor}`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
