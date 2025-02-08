import { NextResponse } from "next/server";
import { spotifyApi, refreshAccessToken } from "@/lib/spotify";

export async function GET() {
  try {
    const accessToken = await refreshAccessToken();
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 });

    const tracks = response.body.items.map((item) => ({
      title: item.track.name,
      artist: item.track.artists.map((artist) => artist.name).join(", "),
      album: item.track.album.name,
      albumImageUrl: item.track.album.images[0]?.url,
      songUrl: item.track.external_urls.spotify,
      playedAt: item.played_at,
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching recent tracks", error);
    return NextResponse.json(
      { error: "Failed to fetch recent tracks" },
      { status: 500 }
    );
  }
}
