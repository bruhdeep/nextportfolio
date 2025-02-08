"use client";

import { useEffect, useState } from "react";

interface NowPlayingTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

const SpotifyNowPlaying = () => {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      const res = await fetch("/api/spotify/now-playing");
      const data = await res.json();
      setTrack(data);
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 10000); // Refresh every 10 sec

    return () => clearInterval(interval);
  }, []);

  if (!track) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-3 p-4 bg-gray-200 dark:bg-gray-800 transition-colors duration-200 rounded-xl shadow-lg w-64 h-20">
      {track.albumImageUrl && (
        <img
          src={track.albumImageUrl}
          alt={track.title}
          className="w-12 h-12 rounded-lg"
        />
      )}
      <div className="overflow-hidden">
        <p className="text-gray-900 dark:text-white font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
          {track.title || "Not Playing"}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
          {track.artist}
        </p>
      </div>
    </div>
  );
};

export default SpotifyNowPlaying;
