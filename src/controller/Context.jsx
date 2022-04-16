import React from "react";
import { io } from "socket.io-client";
const host = window.location.hostname

export const url = host!="localhost"?process.env.REACT_APP_URL_PRODUCTION:process.env.REACT_APP_URL_DEV
export const client = io.connect(url.replace("http://","").replace("https://","").replace("/",""),{
    'reconnection': true,
    'reconnectionDelay': 2500,
    'reconnectionAttempts': 10
  });
export const SocketContext = React.createContext();