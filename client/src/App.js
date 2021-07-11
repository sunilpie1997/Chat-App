import React, { useEffect } from 'react';
import './App.css';
import { useReducer } from 'react';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ChatComponent from './components/socket-chat/chat';
import { authReducer, initialAuthState, AuthContext} from './components/authentication/auth-context';
import Container from '@material-ui/core/Container';
import SearchFriend from './components/socket-chat/search-friend';
import { ChatFriendContext, chatUserState, chatFriendReducer } from './components/socket-chat/chat-friend-context';
import {SocketContext,socket} from './components/socket-chat/socket';
import ProtectedRoute from './components/authentication/protected-route';
import Login from './components/authentication/login';

function App() {

  const [authState, authDispatch ] = useReducer(authReducer, initialAuthState);
  const [chatFriend, setChatFriend] = useReducer(chatFriendReducer,chatUserState);


  useEffect(()=>{
    // whenever user refreshes page and App.js mounts, check localStorage if 'user' is present.
    // if yes, set 'userState'

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

    <Container maxWidth="xl" className="App">
  
      <AuthContext.Provider
        value={{ authState:authState, authDispatch:authDispatch }}>
        <ChatFriendContext.Provider value={{ chatFriend:chatFriend, setChatFriend:setChatFriend }}>
          <SocketContext.Provider value={socket}>
          
            <Router>
              <Switch>
                <Route path="/login" exact component={Login}/>
                <ProtectedRoute path="/" exact component={HomePage}/>   
                <ProtectedRoute path="/chat" exact component={ChatComponent}/>
                <ProtectedRoute path="/add_friend" exact component={SearchFriend}/>
              </Switch>
          
            </Router>
          </SocketContext.Provider>
        </ChatFriendContext.Provider>
      </AuthContext.Provider>

    </Container>
    
  )
}

export default App;
