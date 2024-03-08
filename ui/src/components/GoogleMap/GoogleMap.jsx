import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import config from "../../config";

const MapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      options={{ gestureHandling: "cooperative" }}
      clickableIcons={false}
    >
      <Marker position={{ lat: props.lat, lng: props.lng }} />
    </GoogleMap>
  ))
);

const Map = (props) => {
  return (
    <MapComponent
      lat={props.lat}
      lng={props.lng}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.GOOGLEMAPS_API_KEY}`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `400px` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
};

export default Map;
