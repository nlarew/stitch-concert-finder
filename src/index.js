import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { Router, Redirect, Match } from "@reach/router";
import app, {
  useStitchAuth,
  loginEmailPasswordUser,
  logoutUser,
} from "./stitch";
import { Button } from "reactstrap";
import Login from "./components/Login";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.css";

const Layout = styled.div`
  display: grid;
  grid-template-areas:
    "banner banner banner"
    "left content right";
  grid-template-rows: 40vh auto;
  grid-template-columns: 1fr auto 1fr;
  width: 100vw;
  min-height: 100vh;
  background: #1f2124;
`;

const Banner = props => {
  const { photo } = props;
  const photoId = photo || "1449748040579-354c191a7934";
  const BannerContainer = styled.div`
    grid-area: banner;
    // background: #1f2124;
    background: linear-gradient(0deg, #1f2124 0%, transparent),
      url(https://images.unsplash.com/photo-${photoId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80)
        no-repeat center;
    background-size: cover;
  `;
  return <BannerContainer {...props} />;
};
// https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80
// https://images.unsplash.com/photo-1449748040579-354c191a7934?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80
const Navbar = styled.div`
  height: 60px;
  padding: 10px 20px;
  line-height: 40px;
  display: flex;
  flex-direction: row-reverse;
`;

const Content = styled.div`
  grid-area: content;
  position: relative;
  top: -360px;
`;

// const SearchBanner = props => (
//   <Banner {...props} photo="1449748040579-354c191a7934" />
// );

function MyApp(props) {
  const { hasLoggedInUser } = useStitchAuth();
  const LogoutButton = () => (
    <Button onClick={() => logoutUser(app.auth.user)}>Log Out</Button>
  );
  return (
    <Layout>
      <Banner>
        <Navbar>{hasLoggedInUser && <LogoutButton />}</Navbar>
      </Banner>
      <Content>
        {hasLoggedInUser ? (
          <App handleLogout={() => logoutUser(app.currentUser)} />
        ) : (
          <Login loginEmailPasswordUser={loginEmailPasswordUser} />
        )}
      </Content>
    </Layout>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MyApp />, rootElement);
