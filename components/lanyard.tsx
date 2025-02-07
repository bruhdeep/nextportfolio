/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

const LANYARD_WS = "wss://api.lanyard.rest/socket";
const USER_ID = "413679054777090049"; // Replace with the target Discord user ID

interface DiscordUser {
  username: string;
  public_flags: number;
  id: string;
  discriminator: string;
  avatar: string;
}

interface SpotifyActivity {
  track_id: string;
  timestamps: { start: number; end: number };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

interface Activity {
  type: number;
  timestamps?: { start: number; end?: number };
  state?: string;
  name: string;
  id: string;
  details?: string;
  application_id?: string;
  assets?: {
    small_text?: string;
    small_image?: string;
    large_text?: string;
    large_image?: string;
  };
}

// Remove KV interface
interface Presence {
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  listening_to_spotify: boolean;
  spotify?: SpotifyActivity;
  discord_user: DiscordUser;
  discord_status: string;
  activities: Activity[];
}

export default function LanyardStatus() {
  const [presence, setPresence] = useState<Presence | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [heartbeatInterval, setHeartbeatInterval] = useState<number | null>(
    null
  );
  const [songProgress, setSongProgress] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket(LANYARD_WS);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to Lanyard WebSocket");
      ws.send(
        JSON.stringify({
          op: 2,
          d: { subscribe_to_id: USER_ID },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.op === 1) {
        setHeartbeatInterval(data.d.heartbeat_interval);
      } else if (data.op === 0) {
        setPresence(data.d);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from Lanyard WebSocket");
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!socket || !heartbeatInterval) return;

    const heartbeat = setInterval(() => {
      socket.send(JSON.stringify({ op: 3 }));
      console.log("Sent Heartbeat");
    }, heartbeatInterval);

    return () => clearInterval(heartbeat);
  }, [socket, heartbeatInterval]);

  // Add progress tracking
  useEffect(() => {
    if (!presence?.listening_to_spotify || !presence.spotify) return;

    const startTime = presence.spotify.timestamps.start;
    const endTime = presence.spotify.timestamps.end;
    const duration = endTime - startTime;

    const interval = setInterval(() => {
      const now = Date.now();
      const progress = Math.min(((now - startTime) / duration) * 100, 100);
      setSongProgress(progress);
    }, 1000);

    return () => clearInterval(interval);
  }, [presence?.spotify, presence?.listening_to_spotify]);

  if (!presence) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl w-96">
      <h2 className="text-xl font-bold">{presence.discord_user.username}</h2>
      <p className="text-sm text-gray-400">Status: {presence.discord_status}</p>

      {/* Spotify Activity */}
      {presence.listening_to_spotify && presence.spotify && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm font-semibold">Listening to Spotify:</p>
          <p className="text-lg">{presence.spotify.song}</p>
          <p className="text-sm text-gray-400">{presence.spotify.artist}</p>
          <img
            src={presence.spotify.album_art_url}
            alt="Album Art"
            className="w-20 h-20 mt-2 rounded-md"
          />
          {/* Add progress bar */}
          <div className="mt-2">
            <div className="w-full h-1 bg-gray-700 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${songProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Applications */}
      {presence.activities.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Active Apps:</p>
          {presence.activities
            .filter((activity) => activity.type !== 2)
            .map((activity) => (
              <div
                key={activity.id}
                className="p-2 bg-gray-800 rounded-lg mt-2 flex items-center"
              >
                {/* Activity Image */}
                {activity.assets?.large_image && (
                  <div className="relative mr-3">
                    <img
                      src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                      alt={activity.assets.large_text || activity.name}
                      title={activity.assets.large_text}
                      className="w-12 h-12 rounded-md"
                    />
                    {activity.assets?.small_image && (
                      <div className="absolute -bottom-1 -right-1">
                        <img
                          src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`}
                          alt={activity.assets.small_text || "status"}
                          title={activity.assets.small_text}
                          className="w-5 h-5 rounded-full border-2 border-gray-800 "
                        />
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <p className="text-md font-semibold">{activity.name}</p>
                  {activity.details && (
                    <p className="text-sm text-gray-400">{activity.details}</p>
                  )}
                  {activity.state && (
                    <p className="text-sm text-gray-400">{activity.state}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
