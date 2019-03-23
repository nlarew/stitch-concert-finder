import React from "react";
import styled from "@emotion/styled";
import { Router, Redirect } from "@reach/router";
import { Card, CardBody, Button } from "reactstrap";
import app from "./../stitch";

import {
  Map,
  TileLayer,
  Marker,
  Popup,
  Circle,
  CircleMarker,
  Polygon,
  Polyline,
  Rectangle,
} from "react-leaflet";

const AppCard = styled(Card)`
  width: 600px;
`;

const ConcertMap = styled(Map)`
  height: 400px;
  width: 600px;
`;

function Leaf() {
  const center = [51.505, -0.09];
  const radius = 3 * 1000; // 3 kilometers
  return (
    <ConcertMap center={center} zoom={13}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle center={center} fillColor="blue" radius={radius} />
      <Marker position={[51.5, -0.07]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={[51.52, -0.1]} />
      <Marker position={[51.52, -0.08]} />
    </ConcertMap>
  );
}

const Hello = () => (
  <AppCard>
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  </AppCard>
);

const SearchBar = styled.input`
  width: 600px;
  height: 70px;
  background-color: white;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
`;

const Search = props => {
  return (
    <>
      <SearchBar placeholder="Enter your address..." />
      <Leaf />
    </>
  );
};

export default function App(props) {
  return (
    <Router>
      <Hello path="/" />
      <Search path="/search" />
      <Leaf path="/leaf" />
      <Redirect default from="*" to="/search" />
    </Router>
  );
}
