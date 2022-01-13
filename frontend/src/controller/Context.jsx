import React from "react";
import { io } from "socket.io-client";

export const client = io.connect(`https://discordbackend.vercel.app`)

export const SocketContext = React.createContext();