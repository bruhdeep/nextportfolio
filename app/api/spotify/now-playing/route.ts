import { NextResponse } from "next/server";
import { spotifyApi, refreshAccessToken } from "@/lib/spotify";

export async function GET() {
  try {
    const accessToken = await refreshAccessToken();
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getMyCurrentPlayingTrack();

    if (!response.body || !response.body.item) {
      return NextResponse.json({ isPlaying: false });
    }

    const item = response.body.item;
    const timestamp = response.body.progress_ms;

    if (item.type === "track") {
      const track = item as SpotifyApi.TrackObjectFull;
      return NextResponse.json({
        isPlaying: true,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
        timestamp,
      });
    } else {
      return NextResponse.json({ isPlaying: false });
    }
  } catch (error) {
    console.error("Error fetching now playing track", error);
    return NextResponse.json(
      { error: "Failed to fetch track" },
      { status: 500 }
    );
  }
}
