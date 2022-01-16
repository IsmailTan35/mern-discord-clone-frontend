import React from "react";
import { io } from "socket.io-client";

export const client = io.connect(`https://discordbackend.herokuapp.com`,{
    'reconnection': true,
    'reconnectionDelay': 2500,
    'reconnectionAttempts': 10
  });

export const SocketContext = React.createContext();