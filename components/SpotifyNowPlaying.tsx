"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones } from "lucide-react";
import { useTheme } from "next-themes";

interface NowPlayingTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTrack = async () => {
      const res = await fetch("/api/spotify/now-playing");
      const data = await res.json();
      setTrack(data);
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!track?.isPlaying) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Headphone icon (anchored in place) */}
      <motion.div
        className={`absolute bottom-0 right-0 z-10 flex items-center justify-center w-12 h-12 ${
          theme === "dark" ? "bg-white/90" : "bg-zinc-900/90"
        } rounded-full shadow-lg transition-colors duration-200`}
        animate={{ opacity: isHovered ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Headphones
          className={`w-4 h-4 ${
            theme === "dark" ? "text-zinc-900" : "text-white"
          }`}
        />
      </motion.div>

      {/* Expanding panel behind the icon */}
      <motion.div
        className={`relative flex items-center ${
          theme === "dark"
            ? "bg-white/80 text-zinc-900"
            : "bg-zinc-900/80 text-white"
        } backdrop-blur-md shadow-lg overflow-hidden rounded-full transition-colors duration-200`}
        initial={{ width: 48 }}
        animate={{ width: isHovered ? 280 : 48 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ height: 48 }}
      >
        {/* Slide-in content */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="flex items-center pl-2 pr-14 gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {track?.albumImageUrl && (
                <motion.img
                  src={track.albumImageUrl}
                  alt="Album"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                />
              )}
              <div className="flex flex-col overflow-hidden">
                <a
                  href={track?.songUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-medium truncate hover:underline ${
                    theme === "dark" ? "text-zinc-900" : "text-white"
                  }`}
                >
                  {track?.title}
                </a>
                <p
                  className={`text-[10px] ${
                    theme === "dark" ? "text-zinc-600" : "text-zinc-400"
                  } truncate`}
                >
                  {track?.artist}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
