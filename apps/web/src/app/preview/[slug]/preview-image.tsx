"use client";

import { useState } from "react";

interface PreviewImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackGradient?: string;
}

export function PreviewImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  fallbackGradient = "from-slate-200 to-slate-300",
}: PreviewImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center p-6 text-center`}
      >
        <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
