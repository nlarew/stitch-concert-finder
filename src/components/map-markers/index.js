import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.js";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

const getIcons = ({ isCurrentVenue }) => ({
  address: L.AwesomeMarkers.icon({
    prefix: "fa",
    icon: "home",
    markerColor: "red"
  }),
  venue: L.AwesomeMarkers.icon({
    prefix: "fa",
    icon: "guitar",
    markerColor: isCurrentVenue ? "green" : "blue"
  }),
  favorite: L.AwesomeMarkers.icon({
    prefix: "fa",
    icon: "star",
    markerColor: isCurrentVenue ? "green" : "orange"
  })
});

export function HomeMarker({ children, position, address, isCurrentVenue, ...props }) {
  const icons = getIcons({ isCurrentVenue })
  return (
    <Marker position={position} icon={icons.address} {...props} id="asdfasdf">
      <Popup>YOUR HOME BABY</Popup>
    </Marker>
  );
};
export function VenueMarker({ children, position, isCurrentVenue, ...props }) {
  const icons = getIcons({ isCurrentVenue });
  return (
    <Marker position={position} icon={icons.venue} {...props}>
      {children}
    </Marker>
  );
};
export function CurrentVenueMarker({ children, position, isCurrentVenue, ...props }) {
  const icons = getIcons({ isCurrentVenue });
  return (
    <Marker position={position} icon={icons.venue} {...props}>
      {children}
    </Marker>
  );
};
export function FavoriteVenueMarker({ children, position, isCurrentVenue, ...props }) {
  const icons = getIcons({ isCurrentVenue });
  return (
    <Marker position={position} icon={icons.favorite} {...props}>
      {children}
    </Marker>
  );
};
