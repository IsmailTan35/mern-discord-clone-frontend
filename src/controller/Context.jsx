import React from "react";
import { io } from "socket.io-client";
const hostname = window.location.hostname;
const parsed = window.location.hostname.split(".");
const protocol = window.location.protocol;
// REACT_APP_URL_PRODUCTION is baked in at build time; without it the API is
// assumed to be on the same origin as the page
if (process.env.NODE_ENV === "production" && !process.env.REACT_APP_URL_PRODUCTION)
  console.error(
    "REACT_APP_URL_PRODUCTION was not set when this build was made; set it as a build variable and rebuild."
  );
export const url =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_URL_PRODUCTION || `${protocol}//${hostname}/api/`
    : `${protocol}//${hostname}:10000/api/`;

export const client = io.connect(
  url.replace("http://", "").replace("https://", "").replace("/api/", ""),
  {
    reconnection: true,
    reconnectionDelay: 2500,
    reconnectionAttempts: 10,
    forceNew: true,
  }
);
export const SocketContext = React.createContext();
