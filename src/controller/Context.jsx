import React from "react";
import { io } from "socket.io-client";
const host = window.location.hostname
const protocol = window.location.protocol
export const url = host == "https://discord.vercel.app" ? process.env.REACT_APP_URL_PRODUCTION: `${protocol}//${host}:10000`
export const client = io.connect(url.replace("http://","").replace("https://","").replace("/",""),{
    'reconnection': true,
    'reconnectionDelay': 2500,
    'reconnectionAttempts': 10,
    'forceNew':true
  });
export const SocketContext = React.createContext();