import React from 'react';
import {socket} from '../socket-chat/socket';


export const AuthContext = React.createContext();

//maintains logged in user state for app
export const initialAuthState = {
    user:null,
    loading:true
  
  }
  
export const authReducer = (state, action) => {
  
    switch(action.type)
    {
      case 'login':
        localStorage.setItem("user", JSON.stringify(action.value));
        socket.connect();
        return { ...state, user: action.value, loading:false }
  
      case 'logout':
        localStorage.clear();
        socket.disconnect();
        return { ...state,user: null, loading:false }
  
      case 'default':
        return state;
    }
  }