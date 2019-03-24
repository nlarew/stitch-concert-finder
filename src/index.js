import React from "react";
import ReactDOM from "react-dom";
import app, {
  useStitchAuth,
  loginEmailPasswordUser,
  logoutUser,
} from "./stitch";
import Login from "./components/Login";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.css";

function MyApp(props) {
  const { hasLoggedInUser } = useStitchAuth();
  return hasLoggedInUser ? (
    <App handleLogout={() => logoutUser(app.currentUser)} />
  ) : (
    <Login loginEmailPasswordUser={loginEmailPasswordUser} />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MyApp />, rootElement);
