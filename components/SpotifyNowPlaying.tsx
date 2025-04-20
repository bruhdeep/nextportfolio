"use client";

import React, { useEffect, useState } from "react";

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
    <div>
      <SpotifyNowPlaying />
    </div>
  );
};

const SpotifyNowPlaying = () => {
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

  return (
    <div className="w-full">
      <p className="text-center text-gray-900 dark:text-white">
        {track?.isPlaying 
          ? `bruhdeep is listening to ${track.title} by ${track.artist}`
          : "bruhdeep is not listening to anything"}
      </p>
    </div>
  );
};

export default Spotify;
