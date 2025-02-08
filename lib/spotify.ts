import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const refreshAccessToken = async () => {
  try {
    if (!process.env.SPOTIFY_REFRESH_TOKEN) throw new Error("No refresh token");

    spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);
    const data = await spotifyApi.refreshAccessToken();

    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error) {
    console.error("Error refreshing access token", error);
    return null;
  }
};

export { spotifyApi, refreshAccessToken };
