import React from "react";
import styled from "@emotion/styled";
import Search from "./Search";
import Venue from "./Venue";
import Banner from "./Banner";
import Navbar from "./Navbar";

const AppLayout = styled.div`
  display: grid;
  grid-template-areas:
    "banner banner banner"
    "search list detail";
  grid-template-rows: 140px 1fr;
  grid-template-columns: 3fr 2fr 2fr;
  width: 100vw;
  min-height: 100vh;
  background: #1f2124;
`;

export default function App(props) {
  return (
    <AppLayout>
      <Banner>
        <Navbar />
      </Banner>
      <Search {...props} />
      <Venue />
    </AppLayout>
  );
}

// <Router>
//           <Search path="/search" />
//           <Search path="/search/asdf" />
//           <Redirect default from="/" to="/search" />
//         </Router>
