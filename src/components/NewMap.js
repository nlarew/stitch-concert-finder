/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Map, Popup, TileLayer, LayerGroup } from "react-leaflet";
import {
  Card,
  CardHeader,
  CardText,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import Control from "react-leaflet-control";
import { HomeMarker, VenueMarker, FavoriteVenueMarker } from "./map-markers";
import { useSearch } from "./../hooks/useSearch";
import { SearchBar } from "./Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import * as mongodbActions from "./../stitch/mongodb";
import * as R from "ramda";
import L from 'leaflet'

const StamenTonerTileLayer = () => (
  <TileLayer
    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
  />
);

const StarIcon = () => (
  <FontAwesomeIcon
    css={css`
      margin: auto 8px;
    `}
    icon={faStar}
  />
);

// const getUserActions = ({ venues, setVenues, setCurrentUserProfile }) => ({
//   addFavoriteVenue: async venueId => {
//     console.log("addFavoriteVenue", venueId);
//     const user = await mongodbActions.addFavoriteVenue({ venueId });
//     setCurrentUserProfile(user);
//   },
//   removeFavoriteVenue: async venueId => {
//     console.log("removeFavoriteVenue", venueId);
//     const user = await mongodbActions.removeFavoriteVenue({ venueId });
//     setCurrentUserProfile(user);
//   },
//   starEvent: async (venueId, eventId) => {
//     console.log("starEvent", venueId, eventId);
//     const venue = await mongodbActions.starEvent({ venueId, eventId });
//     const venueIndex = venues.findIndex(v => v.id === venueId);
//     setVenues(R.update(venueIndex, venue, venues));
//   },
//   unstarEvent: async (venueId, eventId) => {
//     console.log("unstarEvent", venueId, eventId);
//     const venue = await mongodbActions.unstarEvent({ venueId, eventId });
//     const venueIndex = venues.findIndex(v => v.id === venueId);
//     setVenues(R.update(venueIndex, venue, venues));
//   }
// });

const SearchResults = props => {
  const { items=[] } = props;
  const hasItems = items.length > 0;
  const listItemStyle = css`
    background-color: #383b3f !important;
  `;

  return (
    <ListGroup>
    {
      hasItems && items.map(item => (
        <ListGroupItem css={listItemStyle} key={item.id}>
          {item.name}
          {item.isFavuorite && <StarIcon />}
        </ListGroupItem>
      ))
    }
    </ListGroup>
  );
}

const ControlCard = props => {
  const cardStyle = css`
    background-color: #383b3f !important;
    height: calc(100% - 40px - 40px);
    min-width: 30vw;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
  `;
  const cardHeaderStyle = css`
    padding-left: 12px;
    padding-right: 12px;
  `;

  const {
    isSearching,
    data: { location, events, venues },
    actions: { handleSearch, clearData },
  } = useSearch();

  // console.log("data", { location, events, venues });

  return (
    <Card css={cardStyle} inverse>
      <CardHeader css={cardHeaderStyle}>
        <SearchBar
          address={"123 Cherry Lane"}
          isSearching={isSearching}
          handleSearch={handleSearch}
        />
      </CardHeader>
      <SearchResults items={venues} />
    </Card>
  );
};

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  };
}

function useWindowSize() {
  let [windowSize, setWindowSize] = useState(getSize());

  function handleResize() {
    setWindowSize(getSize());
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}

const MapAppLayout = styled.div`
  height: 100vh;
  height: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;
  display: grid;
  grid-template-areas:
    "navbar navbar navbar"
    "map    map    map";
  grid-template-rows: 40px 1fr;
`;
const NavbarContainer = styled.div`
  grid-area: navbar;
  box-sizing: border-box;
`
const MapContainer = styled.div`
  grid-area: map;
  box-sizing: border-box;
`;
const mapStyle = css`
  height: 100%;
`;

const VenueMarkers = ({ venues }) => venues.map(venue => (
  <VenueMarker
    key={venue.id}
    isCurrentVenue={false}
    position={[Number(venue.location.lat), Number(venue.location.lng)]}
    zIndexOffset={-100}
    onClick={() => console.log(`clicked ${venue.id}`)}
    onMouseOver={e => { e.target.openPopup() }}
    onMouseOut={e => { e.target.closePopup() }}
  >
    <Popup>
      <h4>{venue.name}</h4>
    </Popup>
  </VenueMarker>
))

function useMapCenter(mapRef, initialCenter) {
  const windowSize = useWindowSize();
  const [center, setCenter] = useState(initialCenter);
  const [windowRecentlyResized, setWindowRecentlyResized] = useState(false);
  const map = mapRef.current && mapRef.current.leafletElement;
  const { x: width, y: height } = map && map.getSize() || { x: null, y: null };
  const centerMap = () => {
    if(map) {
      const flyToTrueCenter = function() {
        map.panTo(center, map.getZoom(), { animate: false });
        map.once("moveend", () => {
          console.log('movedonce')
          // map.panBy(new L.point(width * 0.15, 0), { animate: false });
          // console.log('movedtwice')
        });
      }
      flyToTrueCenter()
      // map.panBy(new L.point(width * 0.15, 0), { animate: false });
    }
    // map.flyTo(center, map.getZoom(), { animate: true });
  };
  useEffect(() => {
    if (windowRecentlyResized) {
      const timeout = setTimeout(() => {
        centerMap();
        setWindowRecentlyResized(false);
      }, 400);
      return () => clearTimeout(timeout);
    } else {
      setWindowRecentlyResized(true);
    }
  }, [width, height]);
}

export default function LeafMap(props) {
  const mapRef = useRef();

  const {
    // isSearching,
    data: { location, venues },
  } = useSearch();
  const searchedCoordinates = location && location.geometry.location
  console.log("NewMap", venues);

  const center = searchedCoordinates || { lat: 40.7133111, lng: -73.9521927 };
  const radius = 2 * 1000; // 2 kilometers
  useMapCenter(mapRef, center);
  
  return (
    <MapAppLayout>
      <NavbarContainer>
        <div
          css={css`
            background-color: #383b3f !important;
            width: 100%;
            height: 100%;
          `}
        />
      </NavbarContainer>
      <MapContainer>
        <Map
          css={mapStyle}
          center={center}
          zoom={12}
          ref={ref => (mapRef.current = ref)}
        >
          <StamenTonerTileLayer />
          <Control position="topright">
            <ControlCard />
          </Control>
          {location && <HomeMarker position={center} />}
          {!location && <FavoriteVenueMarker position={center} />}
          {venues.length > 0 && <VenueMarkers venues={venues} />}
        </Map>
      </MapContainer>
    </MapAppLayout>
  );
};
