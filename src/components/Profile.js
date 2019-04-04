/** @jsx jsx */
import React, { useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import Search, { useVenues } from "./Search";
import List from "./List";
import Venue from "./VenueDetail";
import Banner from "./Banner";
import { VenuesList } from "./List";
import Navbar from "./Navbar";
import { Card, CardBody, CardHeader } from 'reactstrap'
import * as R from 'ramda'
import ErrorBoundary from "react-error-boundary";

import ReactJson from 'react-json-view'

const ProfileLayout = styled.div`
  display: grid;
  grid-template-areas:
    "banner      banner  banner"
    "margin-left profile margin-right";
  grid-template-rows: 140px 1fr;
  grid-template-columns: 1.5fr 3fr 1.5fr;
  width: 100vw;
  min-height: 100vh;
  background: #1f2124;
`;

const ContentCard = styled(Card)`
  grid-area: profile;
  margin: 10px;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

const headerStyle = css`
  padding-left: 0px;
  padding-right: 0px;
`;

function ProfileContent(props) {
  const {
    currentUser,
    venueData: {
      orderedVenues,
      currentVenue,
      setCurrentVenue,
      address,
      userActions
    }
  } = props;
  console.log(currentUser);
  // TODO: Watch for changes to user document and update accordingly
  const isUserOfType = (type) => currentUser && R.find(R.propEq("provider_type", type))(currentUser.identities) !== undefined
  const isEmailPasswordUser = isUserOfType("local-userpass")
  const isFacebookUser = isUserOfType("oauth2-facebook")
  const isGoogleUser = isUserOfType("oauth2-google")
  // TODO: Hydrate venues array from venue ids
  // - Do this from MongoDB
  // - Watch for changes?
  // Build out table that lists favorite venues
  return currentUser ? (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardBody>
          <CardHeader css={headerStyle}>
            <h1>{currentUser.data.name}</h1>
            <h2>{currentUser.id}</h2>
          </CardHeader>
          <div>isEmailPasswordUser: {isEmailPasswordUser ? "T" : "F"}</div>
          <div>isFacebookUser: {isFacebookUser ? "T" : "F"}</div>
          <div>isGoogleUser: {isGoogleUser ? "T" : "F"}</div>
          <ReactJson src={currentUser} theme="monokai" />
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  ) : (
    ""
  );
}

export default function Profile(props) {
  const { currentUserProfile, updateCurrentUserProfile, venueData } = props;
  venueData.userActions = venueData.getUserActions({ updateCurrentUserProfile })
  return (
    <ProfileLayout>
      <Banner>
        <Navbar currentView="profile" />
      </Banner>
      <ProfileContent
        currentUser={currentUserProfile}
        venueData={venueData}
      />
    </ProfileLayout>
  );
}
