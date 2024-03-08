import express from "express";

import config from "../config";
import { getArtistAlbums, searchArtists } from "./spotify";

const segment: { [key: string]: string } = {
  music: "KZFzniwnSyZfZ7v7nJ",
  sports: "KZFzniwnSyZfZ7v7nE",
  arts: "KZFzniwnSyZfZ7v7na",
  film: "KZFzniwnSyZfZ7v7nn",
  misc: "KZFzniwnSyZfZ7v7n1",
};

export const suggest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  // console.log("AUTO COMPLETE: ", req.query);
  const keyword = req.query.keyword;

  fetch(
    `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${config.apiKeys.TICKETMASTER_API_KEY}&keyword=${keyword}`
  )
    .then((response) => response.json())
    .then((data) => {
      res.json(
        data._embedded?.attractions?.map(
          (attraction: any) => attraction.name
        ) ?? []
      );
    })
    .catch((err) => console.error(err));
};

export const search = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  // console.log("SEARCH QUERY: ", req.query);
  let query = req.query;

  const data: { [key: string]: string } = {
    keyword: query.keyword as string,
    radius: query.distance as string,
    geoPoint: query.location as string,
    segmentId: segment[query.category as string] ?? "",
  };

  if (!query.location) {
    res.json([]);
    next();
  }

  let queryParams = new URLSearchParams(data).toString();

  fetch(
    `https://app.ticketmaster.com/discovery/v2/events?apikey=${config.apiKeys.TICKETMASTER_API_KEY}&` +
      queryParams
  )
    .then((response) => response.json())
    .then((data) => {
      const events = data._embedded?.events.map((event: any) => {
        return {
          id: event.id ?? "",
          date: {
            localDate: event.dates?.start?.localDate ?? "",
            localTime: event.dates?.start?.localTime ?? "",
          },
          event: event.name ?? "",
          name: event.name ?? "",
          genre: event.classifications[0]?.segment?.name ?? "",
          category: ((classification: any) => {
            let segment = classification?.segment?.name ?? "";
            let genre = classification?.genre?.name ?? "";
            let subGenre = classification?.subGenre?.name ?? "";
            let type = classification?.type?.name ?? "";
            let subType = classification?.subType?.name ?? "";
            return [segment, genre, subGenre, type, subType].filter(
              (x) => x.toLowerCase() !== "undefined"
            );
          })(event.classifications?.[0] ?? []),
          icon: event.images[0]?.url ?? "",
          venue: event._embedded?.venues[0]?.name ?? "",
        };
      });
      res.json(events ?? []);
    })
    .catch((err) => console.error(err));
};

export const getEventDetails = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  // console.log("EVENT DETAILS: ", req.params);
  const eventId = req.params.eventid;

  // EVENT INFO
  const eventResponse = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events/${eventId}?apikey=${config.apiKeys.TICKETMASTER_API_KEY}`
  );
  const eventData = await eventResponse.json();

  const eventInfo = {
    id: eventData.id ?? "",
    name: eventData.name ?? "",
    date: {
      localDate: eventData.dates?.start?.localDate ?? "",
      localTime: eventData.dates?.start?.localTime ?? "",
    },
    artists:
      eventData._embedded?.attractions?.map(
        (attraction: any) => attraction.name ?? ""
      ) ?? [],
    venue: eventData._embedded?.venues?.[0]?.name ?? "",
    genres: ((classification: any) => {
      let segment = classification?.segment?.name ?? "";
      let genre = classification?.genre?.name ?? "";
      let subGenre = classification?.subGenre?.name ?? "";
      let type = classification?.type?.name ?? "";
      let subType = classification?.subType?.name ?? "";
      return [segment, genre, subGenre, type, subType].filter(
        (x) => x && x.toLowerCase() !== "undefined"
      );
    })(eventData.classifications?.[0] ?? []),
    price_range: {
      min: eventData.priceRanges?.[0]?.min ?? "",
      max: eventData.priceRanges?.[0]?.max ?? "",
    },
    ticket_status: eventData.dates?.status?.code ?? "",
    seat_map: eventData.seatmap?.staticUrl ?? "",
    buy_ticket_at: eventData.url ?? "",
  };

  // VENUE INFO
  const venueName = eventData._embedded.venues[0].name;
  let queryParams = new URLSearchParams({ keyword: venueName }).toString();

  const venueResponse = await fetch(
    `https://app.ticketmaster.com/discovery/v2/venues?apikey=${config.apiKeys.TICKETMASTER_API_KEY}&` +
      queryParams
  );
  // console.log("VENUE DETAILS: ", venueName);
  const venueData = await venueResponse.json();

  const venueInfo = {
    name: venueData?._embedded?.venues?.[0]?.name ?? "",
    address: venueData?._embedded?.venues?.[0]?.address?.line1 ?? "",
    location: venueData?._embedded?.venues?.[0]?.location ?? {},
    city: venueData?._embedded?.venues?.[0]?.city?.name ?? "",
    state: venueData?._embedded?.venues?.[0]?.state?.name ?? "",
    phone:
      venueData?._embedded?.venues?.[0]?.boxOfficeInfo?.phoneNumberDetail ?? "",
    open_hours:
      venueData?._embedded?.venues?.[0]?.boxOfficeInfo?.openHoursDetail ?? "",
    rules: {
      general:
        venueData?._embedded?.venues?.[0]?.generalInfo?.generalRule ?? "",
      child: venueData?._embedded?.venues?.[0]?.generalInfo?.childRule ?? "",
    },
    google_map_link: "",
  };

  // ARTIST INFO
  const artists: any[] = (eventData._embedded.attractions ?? [])
    .filter((attr: any) => attr.classifications[0].segment.name === "Music")
    .map((attr: any) => attr.name);
  let artistsInfo = await Promise.all(artists.map(getArtistDetails));
  artistsInfo = artistsInfo.filter((x) => x !== undefined);

  res.json({
    id: eventData.id,
    info: eventInfo,
    venue: venueInfo,
    artists: artistsInfo,
  });
};

const getArtistDetails = async (artistName: string) => {
  // console.log("ARTIST DETAILS: ", artistName);
  const artist: any = await searchArtists(artistName);
  if (!artist.id) {
    return undefined;
  }
  const albums = await getArtistAlbums(artist.id);

  const artistInfo = {
    ...artist,
    albums,
  };

  return artistInfo;
};
