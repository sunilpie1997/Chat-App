import { io } from "socket.io-client";
import React from "react";

// autoconnect is false as we don't want it to connect automatically. we will connect later
const URL = process.env.REACT_APP_BACKEND_URL;
export const socket = io(URL, { 

  // to send cookies
  withCredentials:true,
  autoConnect: false });


  
export const SocketContext = React.createContext();