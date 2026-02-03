"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ProjectSliderProps {
  images?: string[];
  title?: string;
}

export const ProjectSlider: React.FC<ProjectSliderProps> = ({
  images = [],
  title = "",
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full rounded-2xl overflow-hidden relative my-6">
      <motion.div
        className="flex w-full"
        animate={{ x: `-${index * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {images.map((src, imgIdx) => (
          <img
            key={imgIdx}
            src={src}
            alt={`${title} ${imgIdx + 1}`}
            className="w-full object-cover flex-shrink-0 rounded-md border border-zinc-800"
          />
        ))}
      </motion.div>

      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-1">
          {images.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`w-2 h-2 rounded-full transition-all ${
                dotIdx === index ? "bg-white shadow" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
