import React from "react";
import ReactDOM from "react-dom";
import app, {
  useStitchAuth,
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  logoutUser,
  handleOAuthRedirects,
} from "./stitch";
import Login from "./components/Login";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

handleOAuthRedirects();

function MyApp(props) {
  const { hasLoggedInUser } = useStitchAuth();
  return hasLoggedInUser ? (
    <App handleLogout={() => logoutUser(app.currentUser)} />
  ) : (
    <Login
      loginEmailPasswordUser={loginEmailPasswordUser}
      loginFacebookUser={loginFacebookUser}
      loginGoogleUser={loginGoogleUser}
    />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MyApp />, rootElement);
