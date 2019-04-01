import React, { useRef } from "react";
import styled from "@emotion/styled";
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
// import { Card, CardTitle, CardText, CardFooter } from "reactstrap";
// import Control from "react-leaflet-control";
import DivIcon from "react-leaflet-div-icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHome } from "@fortawesome/free-solid-svg-icons";
const HomeMarker = ({ position }) => (
  <DivIcon position={position}>
    <svg
      className="user-location"
      viewBox="0 0 120 120"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="50" />
    </svg>
  </DivIcon>
);

const ConcertMapContainer = styled.div`
  height: 100%;
`;
const ConcertMap = styled(Map)`
  height: 100%;
  border-radius: 4px;
`;

export default React.memo(function LeafMap(props) {
  const { venues, setCurrentVenue } = props;
  const mapRef = useRef();

  const renderEventMarkers = center => {
    return (
      center &&
      venues &&
      venues.map(venue => {
        const setAsCurrent = () => {
          setCurrentVenue(venue);
        };
        return (
          <Marker
            key={venue.id}
            position={[Number(venue.location.lat), Number(venue.location.lng)]}
            onClick={setAsCurrent}
          >
            <Popup>
              <h2>{venue.name}</h2>
            </Popup>
          </Marker>
        );
      })
    );
  };

  const center = (props.center && [props.center.lat, props.center.lng]) || [
    40.7133111,
    -73.9521927,
  ];
  const radius = 2 * 1000; // 5 kilometers

  const StamenTonerTileLayer = () => (
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
    />
  );

  const DefaultTileLayer = () => (
    <TileLayer
      attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );

  return (
    <ConcertMapContainer>
      <ConcertMap center={center} zoom={12} ref={mapRef}>
        <StamenTonerTileLayer />
        {props.center && venues.length > 0 && (
          <>
            <Circle center={center} fillColor="blue" radius={radius + 260} />
          </>
        )}
        {renderEventMarkers(props.center)}
      </ConcertMap>
    </ConcertMapContainer>
  );
});

// <Control position="bottomright">
//   <Card inverse color="dark">
//     <CardTitle>My Card</CardTitle>
//     <CardText>This is some text on my card,</CardText>
//     <CardFooter>This is the footer</CardFooter>
//   </Card>
// </Control>

// <HomeMarker position={{ lat: center[0], lng: center[1] }}>
//   <Popup>
//     <strong>Your Address:</strong>
//     <br />
//     {center}
//   </Popup>
// </HomeMarker>
