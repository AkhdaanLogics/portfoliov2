"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = {
  src?: string;
  title?: string;
};

export const MusicPlayer: React.FC<Props> = ({
  src = "/music.mp3",
  title = "Lofi",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);

    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      if (!isLoaded) {
        const response = await fetch(src);
        if (!response.ok) throw new Error("Failed to load audio");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
        audio.src = url;
        setIsLoaded(true);
      }
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-white shadow-lg backdrop-blur-md">
      <audio ref={audioRef} preload="none" playsInline />
      <button
        type="button"
        onClick={togglePlay}
        className="h-9 w-9 rounded-full bg-white/15 text-white transition hover:bg-white/25"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="mx-auto h-4 w-4" />
        ) : (
          <Play className="mx-auto h-4 w-4" />
        )}
      </button>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] uppercase tracking-wide text-white/60">
          {isPlaying ? "Now Playing" : "Paused"}
        </span>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
};
