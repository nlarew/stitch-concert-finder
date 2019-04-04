import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.js";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

const icons = {
  address: L.AwesomeMarkers.icon({
    prefix: "fa",
    icon: "home",
    markerColor: "red"
  }),
  venue: L.AwesomeMarkers.icon({
    prefix: "fa",
    icon: "guitar",
    markerColor: "blue"
  }),
  favorite: L.AwesomeMarkers.icon({
    prefix: "fa",
    icon: "star",
    markerColor: "orange"
  })
};
export function HomeMarker({ children, position, address }) {
  return (
    <Marker position={position} icon={icons.address}>
      <Popup>YOUR HOME BABY</Popup>
    </Marker>
  );
};
export function VenueMarker({ children, position, venue }) {
  return (
    <Marker position={position} icon={icons.venue}>
      {children}
    </Marker>
  );
};
export function CurrentVenueMarker({ children, position, venue }) {
  return (
    <Marker position={position} icon={icons.venue}>
      {children}
    </Marker>
  );
};
export function FavoriteVenueMarker({ children, position, venue }) {
  return (
    <Marker position={position} icon={icons.favorite}>
      {children}
    </Marker>
  );
};
