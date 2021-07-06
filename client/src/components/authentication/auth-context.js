import React from 'react';
import {socket} from '../socket-chat/socket';


export const AuthContext = React.createContext();

//maintains logged in user state for app
export const userState = {
    user:null
  
  }
  
export const authReducer = (state, action) => {
  
    switch(action.type)
    {
      case 'login':
        socket.connect();
        return { user: action.value }
  
      case 'logout':
        socket.disconnect();
        return {  user: null }
  
      case 'default':
        return state
    }
  }