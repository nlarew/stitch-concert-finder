import React, { useRef } from "react";
import styled from "@emotion/styled";
import {
  Map,
  TileLayer,
  Popup,
  Circle,
  LayerGroup,
} from "react-leaflet";
import { HomeMarker, VenueMarker, FavoriteVenueMarker } from "./map-markers";

const ConcertMapContainer = styled.div`
  height: 100%;
`;
const ConcertMap = styled(Map)`
  height: 100%;
  border-radius: 4px;
`;

export default React.memo(function LeafMap(props) {
  const { venues, currentVenue, setCurrentVenue } = props;
  const mapRef = useRef();

  const center = (props.center && [props.center.lat, props.center.lng]) || [
    40.7133111,
    -73.9521927,
  ];
  const radius = 2 * 1000; // 2 kilometers

  const renderEventMarkers = center => {
    const render = (venues) => {
      const favoriteVenues = []
      const otherVenues = []
      for (const venue of venues) {
        if (venue.isFavorite) { favoriteVenues.push(venue) }
        else { otherVenues.push(venue) }
      }
      const Markers = {
        FavoriteVenues: () => (
          <LayerGroup>
            {favoriteVenues.map(venue => {
              const isCurrentVenue = currentVenue && currentVenue.id === venue.id;
              const setAsCurrent = () => {
                setCurrentVenue(venue);
              };
              return (
                <FavoriteVenueMarker
                  key={venue.id}
                  position={[
                    Number(venue.location.lat),
                    Number(venue.location.lng)
                  ]}
                  zIndexOffset={100}
                  onClick={setAsCurrent}
                  isCurrentVenue={isCurrentVenue}
                  onMouseOver={e => {
                    e.target.openPopup();
                  }}
                  onMouseOut={e => {
                    e.target.closePopup();
                  }}
                >
                  <Popup>
                    <h4>{venue.name}</h4>
                  </Popup>
                </FavoriteVenueMarker>
              );})}
          </LayerGroup>
        ),
        OtherVenues: () => (
          <LayerGroup>
            {otherVenues.map(venue => {
              const isCurrentVenue = currentVenue && currentVenue.id === venue.id;
              const setAsCurrent = () => {
                setCurrentVenue(venue);
              };
              return (
                <VenueMarker
                  key={venue.id}
                  position={[
                    Number(venue.location.lat),
                    Number(venue.location.lng)
                  ]}
                  zIndexOffset={80}
                  onClick={setAsCurrent}
                  isCurrentVenue={isCurrentVenue}
                  onMouseOver={e => {
                    e.target.openPopup();
                  }}
                  onMouseOut={e => {
                    e.target.closePopup();
                  }}
                >
                  <Popup>
                    <h4>{venue.name}</h4>
                  </Popup>
                </VenueMarker>
              );
            })}
          </LayerGroup>
        )
      };
      return <><Markers.FavoriteVenues /><Markers.OtherVenues /></>
    }
    return center && venues && render(venues)
    // return (
    //   center &&
    //   venues &&
    //   venues.map(venue => {
    //     const setAsCurrent = () => {
    //       setCurrentVenue(venue);
    //     };
    //     // const isCurrentVenue = currentVenue && currentVenue.id === venue.id;
    //     const Marker = venue.isFavorite
    //       ? FavoriteVenueMarker
    //       : VenueMarker;
    //     return (
    //       <Marker
    //         key={venue.id}
    //         position={[
    //           Number(venue.location.lat),
    //           Number(venue.location.lng)
    //         ]}
    //         zIndexOffset={-10}
    //         onClick={setAsCurrent}
    //       >
    //         <Popup>
    //           <h4>{venue.name}</h4>
    //         </Popup>
    //       </Marker>
    //     );
    //   })
    // );
  };

  const StamenTonerTileLayer = () => (
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
    />
  );

  // const DefaultTileLayer = () => (
  //   <TileLayer
  //     attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //   />
  // );

  return (
    <ConcertMapContainer>
      <ConcertMap center={center} zoom={12} ref={mapRef}>
        <StamenTonerTileLayer />
        {props.center && venues.length > 0 && (
          <Circle center={center} fillColor="blue" radius={radius + 260} />
        )}
        {props.center && <HomeMarker position={props.center} />}
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
