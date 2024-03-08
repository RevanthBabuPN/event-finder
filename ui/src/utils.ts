import config from "./config";
var geohash = require("ngeohash");

export const geohashFromAddress = async (location: string) => {
  const params = new URLSearchParams({ address: location });
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLEMAPS_API_KEY}&` +
      params
  )
    .then((response) => response.json())
    .then((data) => data["results"][0]["geometry"]["location"])
    .then(({ lat, lng }) => geohash.encode(lat, lng, 7))
    .catch(() => {
      return null;
    });
};

export const geohashFromIP = async () => {
  return fetch(`https://ipinfo.io/json?token=${config.IPINFO_API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const [lat, lng] = data.loc.split(",");
      return geohash.encode(lat, lng, 7);
    })
    .catch(() => {
      return null;
    });
};
