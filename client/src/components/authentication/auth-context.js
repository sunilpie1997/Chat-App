import React,{ useReducer, useEffect} from 'react';
import {socket} from '../socket-chat/socket';

// you can also built an wrapper for useContext() for both 'AuthStateContext' and 'AuthUpdaterContext'
// https://kentcdodds.com/blog/how-to-optimize-your-context-value

export const AuthStateContext = React.createContext();

export const AuthUpdaterContext = React.createContext();

//maintains auth state for app
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
  
      default:
        return state;
    }
  }


export const AuthProvider = ({children}) => {

  const [authState, authDispatch ] = useReducer(authReducer, initialAuthState);

  useEffect(()=>{
    
    // whenever user refreshes page check localStorage if 'user' is present.
    const user =  JSON.parse(localStorage.getItem("user"));
    console.log("user is ",user);

    if(user)
    {
      authDispatch({type:'login', value: user});    
    }
    else
    {
      // to set loading:false
      authDispatch({type:'logout'});
    }

  },[]);


  return (
    
    <AuthStateContext.Provider value={authState}>
      <AuthUpdaterContext.Provider value={authDispatch}>
        {children}
      </AuthUpdaterContext.Provider>
    </AuthStateContext.Provider>
  );

} 