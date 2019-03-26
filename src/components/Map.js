import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Map, TileLayer, Marker, Popup, Circle } from "react-leaflet";

const ConcertMapContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 20px;
`;
const ConcertMap = styled(Map)`
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

export default function LeafMap(props) {
  const { venues, addressLocation } = props;

  const renderEventMarkers = () => {
    return (
      venues &&
      venues.map(venue => {
        return (
          <Marker
            key={venue.id}
            position={[Number(venue.latitude), Number(venue.longitude)]}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        );
      })
    );
  };

  const center = (addressLocation && [
    addressLocation.lat,
    addressLocation.lng,
  ]) || [51.505, -0.09];
  const radius = 5 * 1000; // 5 kilometers
  return (
    <ConcertMapContainer>
      <ConcertMap center={center} zoom={12}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={center} fillColor="blue" radius={radius} />
        <Marker position={center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {renderEventMarkers()}
      </ConcertMap>
    </ConcertMapContainer>
  );
}
