import React, { useEffect } from 'react';
import './App.css';
import { useReducer } from 'react';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ChatComponent from './components/socket-chat/chat';
import { authReducer, userState, AuthContext} from './components/authentication/auth-context';
import Container from '@material-ui/core/Container';
import SearchFriend from './components/socket-chat/search-friend';
import { ChatFriendContext, chatUserState, chatFriendReducer } from './components/socket-chat/chat-friend-context';
import {SocketContext,socket} from './components/socket-chat/socket';

function App() {

  const [loggedInUser, authAction ] = useReducer(authReducer, userState);
  const [chatFriend, setChatFriend] = useReducer(chatFriendReducer,chatUserState);


  useEffect(()=>{
    // whenever user refreshes page and App.js mounts, check localStorage if 'user' is present.
    // if yes, set 'userState'

    const user =  JSON.parse(localStorage.getItem("user"));
    console.log("user is ",user);

    if(user)
    {
      authAction({type:'login', value: user});    
    }

  },[]);

  return (

    <Container maxWidth="xl" className="App">
  
      <AuthContext.Provider
        value={{ loggedInUser:loggedInUser, authAction:authAction }}>
        <ChatFriendContext.Provider value={{ chatFriend:chatFriend, setChatFriend:setChatFriend }}>
          <SocketContext.Provider value={socket}>
          
            <Router>
              <Switch>
                <Route path="/" exact component={HomePage}/>   
                <Route path="/chat" exact component={ChatComponent}/>
                <Route path="/add_friend" exact component={SearchFriend}/>
              </Switch>
          
            </Router>
          </SocketContext.Provider>
        </ChatFriendContext.Provider>
      </AuthContext.Provider>

    </Container>
    
  )
}

export default App;
