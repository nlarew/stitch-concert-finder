import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { handleOAuthRedirects } from "./stitch";
import AppRouter from './components/AppRouter'

import { StitchAuthProvider } from "./hooks/useAuth";
import { SearchProvider } from "./hooks/useSearch";
import NewMap from './components/NewMap'

handleOAuthRedirects();

const rootElement = document.getElementById("root");

const withAppContext = Component => props => (
  <StitchAuthProvider>
    <SearchProvider>
      <Component {...props} />
    </SearchProvider>
  </StitchAuthProvider>
)

const App = withAppContext(AppRouter);
ReactDOM.render(<App />, rootElement);
