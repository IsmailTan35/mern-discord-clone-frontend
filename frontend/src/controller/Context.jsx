import React from "react";
import { io } from "socket.io-client";
const protocol = window.location.protocol
console.log(process.env.REACT_APP_URL_PRODUCTION);
console.log(protocol)
export const client = io.connect(protocol=="https:"?process.env.REACT_APP_URL_PRODUCTION:process.env.REACT_APP_URL_DEV,{
    'reconnection': true,
    'reconnectionDelay': 2500,
    'reconnectionAttempts': 10
  });

export const SocketContext = React.createContext();