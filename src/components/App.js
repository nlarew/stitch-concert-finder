import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Router, Redirect } from "@reach/router";
import { Card, CardBody, Button, InputGroup, Input, Table } from "reactstrap";
// import app from "./../stitch";

import { Map, TileLayer, Marker, Popup, Circle } from "react-leaflet";

import { Songkick } from "./../stitch";

const AppCard = styled(Card)`
  width: 600px;
`;

const ConcertMap = styled(Map)`
  height: 600px;
  width: 850px;
`;

function Leaf(props) {
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

const SearchBar = styled(Input)`
  width: 850px;
  height: 70px;
  background-color: white;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 0;
`;

// Date: start.date
// Name: displayName
// Artist: performance[0].artist.displayName
// Venue: venue.displayName
// Time: start.time

const EventsTable = props => {
  const { events } = props;
  console.log(events);
  const renderEventRows = () => {
    return events.map(event => (
      <tr key={event.id}>
        <td>{event.start.date}</td>
        <td>{event.displayName}</td>
        <td>{event.performance[0].artist.displayName}</td>
        <td>{event.venue.displayName}</td>
        <td>{event.start.time}</td>
      </tr>
    ));
  };
  return (
    <Table dark>
      <thead>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Artist</th>
          <th>Venue</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>{renderEventRows()}</tbody>
    </Table>
  );
};

function useEventSearch(addr) {
  const [address, setAddress] = useState(addr);
  const [events, setEvents] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleEventInputChange = e => {
    setAddress(e.currentTarget.value);
  };

  function search(addr) {
    if (fetching) {
      cancelCurrentSearch();
    }
    setFetching(true);
  }

  function cancelCurrentSearch() {
    setFetching(false);
  }

  function searchForEvents() {
    if (fetching) {
      const upcoming = Songkick.getUpcomingEventsForVenue("foobar lounge").then(
        events => {
          setEvents(events);
          setFetching(false);
        },
      );
      return () => upcoming.promiseStatus === "pending" && upcoming.reject();
    }
  }
  useEffect(searchForEvents, [fetching]);

  const [venues, setVenues] = useState([]);
  function groupEventsByVenue() {
    let upcomingVenues = venues;
    events.forEach(event => {
      if (upcomingVenues.includes(event.venue)) {
        upcomingVenues = upcomingVenues.map(venue => {
          return event.venue.id === venue.id
            ? { ...event.venue, events: [...event.venue.events, event] }
            : event;
        });
      } else {
        upcomingVenues.push({ ...event.venue, events: [event] });
      }
    });
    setVenues(upcomingVenues);
  }
  useEffect(groupEventsByVenue, [events]);

  return { events, venues, address, search, handleEventInputChange };
}

const Search = props => {
  // const [events, setEvents] = useState([]);
  const {
    events,
    venues,
    address,
    search,
    handleEventInputChange,
  } = useEventSearch();
  return (
    <>
      <SearchBar
        onChange={handleEventInputChange}
        value={address}
        placeholder="Enter your address..."
      />
      <Leaf venues={venues} />
      {events.length ? (
        <EventsTable events={events} />
      ) : (
        <Button
          onClick={() => {
            search(address);
          }}
        >
          Get Events
        </Button>
      )}
    </>
  );
};

export default function App(props) {
  return (
    <Router>
      <Search path="/search" />
      <Search path="/search/asdf" />
      <Redirect default from="/" to="/search" />
    </Router>
  );
}
