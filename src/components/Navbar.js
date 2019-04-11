/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import app, { logoutUser } from "./../stitch";
import { navigate } from "@reach/router";
import { Button } from "reactstrap";

const NavbarContainer = styled.div`
  height: 60px;
  padding: 10px 20px;
  line-height: 40px;
  display: flex;
  flex-direction: row-reverse;
`;

const LogoutButton = () => (
  <Button
    onClick={() => { logoutUser(app.auth.user) }}
    color="info"
    css={css`
      margin-left: 10px;
    `}
  >
    Log Out
  </Button>
);

const UserProfileButton = ({userId}) => (
  <Button onClick={() => navigate(`/profile/${userId}`)}>Your Profile</Button>
)

const GuestUserButton = () => (
  <Button disabled>Guest User</Button>
)

function Navbar(props) {
  const { currentUserProfile } = props;
  return (
    <NavbarContainer>
      <LogoutButton />
      {currentUserProfile && !currentUserProfile.isGuest ? (
        <UserProfileButton userId={app.auth.user.id} />
      ) : (
        <GuestUserButton />
      )}
    </NavbarContainer>
  );
}

export default Navbar;
