import React from "react";
import { io } from "socket.io-client";
const parsed = window.location.hostname.split(".")
const protocol = window.location.protocol
export const url = parsed.includes("vercel") ? process.env.REACT_APP_URL_PRODUCTION: `${protocol}//localhost:10000`
console.log(parsed.includes("vercel"))
export const client = io.connect(url.replace("http://","").replace("https://","").replace("/",""),{
    'reconnection': true,
    'reconnectionDelay': 2500,
    'reconnectionAttempts': 10,
    'forceNew':true
  });
export const SocketContext = React.createContext();