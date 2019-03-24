import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Router, Redirect } from "@reach/router";
import Search from "./Search";
import Banner from "./Banner";
import Navbar from "./Navbar";

const AppLayout = styled.div`
  display: grid;
  grid-template-areas:
    "search content"
    "search content";
  grid-template-columns: 40% 60%;
  width: 100vw;
  min-height: 100vh;
  background: #1f2124;
`;

const SearchSectionLayout = styled.div`
  grid-area: search;
  display: flex;
  flex-direction; column;
`;

const ContentSectionLayout = styled.div`
  grid-area: content;
  background-color: rebeccapurple;
`;

export default function App(props) {
  return (
    <AppLayout>
      <SearchSectionLayout>
        <Search />
      </SearchSectionLayout>
      <ContentSectionLayout />
    </AppLayout>
  );
}

// <Router>
//           <Search path="/search" />
//           <Search path="/search/asdf" />
//           <Redirect default from="/" to="/search" />
//         </Router>
