import React from "react";
import styled from "@emotion/styled";
import { Map, TileLayer, Marker, Popup, Circle } from "react-leaflet";

const ConcertMap = styled(Map)`
  height: 50%;
`;

export default function LeafMap(props) {
  const { venues } = props;
  const renderEventMarkers = () => {
    return (
      venues &&
      venues.map(venue => {
        return (
          <Marker key={venue.id} position={[venue.lat, venue.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        );
      })
    );
  };

  const center = [51.505, -0.09];
  const radius = 3 * 1000; // 3 kilometers
  return (
    <ConcertMap center={center} zoom={13}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle center={center} fillColor="blue" radius={radius} />
      {renderEventMarkers()}
      <Marker position={[51.5, -0.07]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={[51.52, -0.08]} />
    </ConcertMap>
  );
}
