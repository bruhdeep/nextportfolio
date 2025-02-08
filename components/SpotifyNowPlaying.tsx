"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface NowPlayingTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

const Spotify = () => {
  return (
    <div className="fixed bottom-4 right-4">
      <SpotifyNowPlaying />
    </div>
  );
};

const ROTATION_RANGE = 22.5;
const HALF_ROTATION_RANGE = 22.5 / 2;

const SpotifyNowPlaying = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [track, setTrack] = useState<NowPlayingTrack | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      const res = await fetch("/api/spotify/now-playing");
      const data = await res.json();
      setTrack(data);
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!track) return null;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="spotify h-20 w-72 rounded-xl bg-violet-200 dark:bg-gray-800 flex gap-4 items-center px-4 py-2"
    >
      <motion.img
        src={track.albumImageUrl}
        alt={track.title}
        className="h-14 w-14 rounded-xl"
        whileHover={{ scale: 1.1 }}
      />
      <div className="overflow-hidden">
        <p
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-gray-900 dark:text-white font-medium whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          {track.title || "Not Playing"}
        </p>
        <p
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          {track.artist}
        </p>
      </div>
    </motion.div>
  );
};

export default Spotify;
