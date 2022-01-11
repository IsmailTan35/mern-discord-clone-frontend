import React from "react";
import { io } from "socket.io-client";

export const client = io.connect(`http://${"localhost"}:${10000}`)

export const SocketContext = React.createContext();