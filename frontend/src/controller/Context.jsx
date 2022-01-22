import React from "react";
import { io } from "socket.io-client";
const protocol = window.location.protocol
export const client = io.connect(`${protocol}//localhost:10000`,{
    'reconnection': true,
    'reconnectionDelay': 2500,
    'reconnectionAttempts': 10
  });

export const SocketContext = React.createContext();