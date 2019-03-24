import React from "react";
import styled from "@emotion/styled";
import { Map, TileLayer, Marker, Popup, Circle } from "react-leaflet";

const ConcertMapContainer = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 20px;
`;
const ConcertMap = styled(Map)`
  width: 100%;
  height: calc(100% - 80px);
  border-radius: 4px;
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
