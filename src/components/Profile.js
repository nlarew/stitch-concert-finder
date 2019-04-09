/** @jsx jsx */
import React, { useState, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import Banner from "./Banner";
import { VenuesList } from "./List";
import Navbar from "./Navbar";
import { Button, Card, CardBody, CardHeader } from 'reactstrap'
import ErrorBoundary from "react-error-boundary";
import { getVenuesById, useWatchUser } from "./../stitch/mongodb";
import { navigate } from "@reach/router"

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

const AppButton = props => (
  <Button onClick={() => navigate("/app")}>{props.children}</Button>
);

function ProfileContent(props) {
  const { currentUserProfile, userId } = props;
  // const isUserOfType = (type) => currentUser && R.find(R.propEq("provider_type", type))(currentUser.identities) !== undefined
  // const isEmailPasswordUser = isUserOfType("local-userpass")
  // const isFacebookUser = isUserOfType("oauth2-facebook")
  // const isGoogleUser = isUserOfType("oauth2-google")
  const [currentVenue, setCurrentVenue] = useState(null);
  const currentUser = useWatchUser(userId);
  console.log('p', userId, currentUser)
  const [favoriteVenues, setFavoriteVenues] = useState([])
  const favoriteVenueIds = currentUser && currentUser.favoriteVenues;
  useEffect(() => {
    const updateVenues = async () => {
      console.log('updating venues')
      const venues = await getVenuesById(currentUser.favoriteVenues);
      setFavoriteVenues(venues);
    }
    if (currentUser) { updateVenues() }
  }, [currentUser, favoriteVenueIds])
  return currentUser ? (
    <ContentCard inverse>
      <ErrorBoundary>
        <CardHeader css={css`padding-bottom: 0;`}>
          <AppButton>{"< Back to the app"}</AppButton>
        </CardHeader>
        <CardBody css={css`padding-top: 0;`}>
          <CardHeader css={headerStyle}>
            <h1>{currentUser.data.name || currentUser.data.email}</h1>
            <h2>{currentUser.id}</h2>
            {currentUser.id === currentUserProfile.id && (
              <Button
                onClick={() => {
                  navigate("/profile/link");
                }}
              >
                Link another Account
              </Button>
            )}
          </CardHeader>
          <VenuesList
            venues={favoriteVenues}
            currentVenue={currentVenue}
            setCurrentVenue={setCurrentVenue}
            title="Favorite Venues"
          />
        </CardBody>
      </ErrorBoundary>
    </ContentCard>
  ) : (
    ""
  );
}

export default function Profile(props) {
  const { currentUserProfile, setCurrentUserProfile, venueData, userId } = props;
  console.log("userId", userId);
  venueData.userActions = venueData.getUserActions({ setCurrentUserProfile})
  
  return (
    <ProfileLayout>
      <Banner>
        <Navbar currentView="profile" />
      </Banner>
      <ProfileContent
        currentUserProfile={currentUserProfile}
        userId={userId}
      />
    </ProfileLayout>
  );
}
