import SpotifyWebApi from "spotify-web-api-node";

import config from "../config";

const spotifyApi = new SpotifyWebApi({
  clientId: config.apiKeys.SPOTIFY_API.clientId,
  clientSecret: config.apiKeys.SPOTIFY_API.clientSecret,
});

spotifyApi.clientCredentialsGrant().then(
  (data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  (err) => {
    console.error(err);
  }
);

export const searchArtists = async (artistName: string): Promise<any> => {
  return spotifyApi
    .searchArtists(artistName)
    .then((data: any) => {
      const artist: any = data.body.artists.items.find(
        (artist: any) => artist.name.toLowerCase() === artistName.toLowerCase()
      );
      let artistInfo = {
        id: artist?.id,
        name: artist ? artistName : "",
        image: artist?.images?.[0]?.url,
        followers: artist?.followers.total.toLocaleString("en-US"),
        popularity: artist?.popularity,
        spotify_link: artist?.external_urls.spotify,
      };
      return artistInfo;
    })
    .catch(async (err: any) => {
      await refreshAccessToken();
      return spotifyApi.searchArtists(artistName).then((data: any) => {
        const artist: any = data.body.artists.items.find(
          (artist: any) =>
            artist.name.toLowerCase() === artistName.toLowerCase()
        );
        let artistInfo = {
          id: artist?.id,
          name: artist ? artistName : "",
          image: artist?.images?.[0]?.url,
          followers: artist?.followers.total.toLocaleString("en-US"),
          popularity: artist?.popularity,
          spotify_link: artist?.external_urls.spotify,
        };
        return artistInfo;
      });
    });
};

export const getArtistAlbums = async (artistID: string): Promise<any> => {
  return spotifyApi
    .getArtistAlbums(artistID, { limit: 3 })
    .then((data: any) => {
      return data.body.items.map((item: any) => item.images[0].url);
    })
    .catch(async (err: any) => {
      // if (err.statusCode === 401) {
      await refreshAccessToken();
      return spotifyApi
        .getArtistAlbums(artistID, { limit: 3 })
        .then((data: any) =>
          data.body.items.map((item: any) => item.images[0].url)
        );
      // } else {
      //   console.error(err);
      // }
    });
};

const refreshAccessToken = (): Promise<void> => {
  // console.log("REFRESH CALLED");
  return spotifyApi.clientCredentialsGrant().then(
    (data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    },
    (err) => {
      console.error(err);
    }
  );
};
