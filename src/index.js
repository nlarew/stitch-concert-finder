import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { handleOAuthRedirects } from "./stitch";
import AppRouter from './components/AppRouter'

import useAuth from "./hooks/useAuth";
import NewMap from './components/NewMap'

handleOAuthRedirects();

const rootElement = document.getElementById("root");



ReactDOM.render(<AppRouter />, rootElement);
