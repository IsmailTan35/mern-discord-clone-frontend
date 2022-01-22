import React from "react";
import { io } from "socket.io-client";
const protocol = window.location.protocol
const dev=`${protocol}//localhost:10000`
const product=`https://discordbackend.herokuapp.com/`

export const client = io.connect(product,{
    'reconnection': true,
    'reconnectionDelay': 2500,
    'reconnectionAttempts': 10
  });

export const SocketContext = React.createContext();