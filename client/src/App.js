import React, { useEffect } from 'react';
import './App.css';
import { useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { authReducer, initialAuthState, AuthContext} from './components/authentication/auth-context';
import Container from '@material-ui/core/Container';
import { ChatFriendContext, chatUserState, chatFriendReducer } from './components/socket-chat/chat-friend-context';
import {SocketContext,socket} from './components/socket-chat/socket';
import ProtectedRoute from './components/authentication/protected-route';
import Login from './components/authentication/login';
import DashBoard from './components/dashboard';
import MatchNotFound from './components/match-not-found';

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
          
                <Redirect exact from="/" to="/dashboard" />
                
                <Route exact path="/login" render={props => <Login {...props} />}/>

                <ProtectedRoute path="/dashboard" component={DashBoard} />
                <Route path="*" render={props => <MatchNotFound {...props} />} />

              </Switch>
          
            </Router>
          </SocketContext.Provider>
        </ChatFriendContext.Provider>
      </AuthContext.Provider>

    </Container>
    
  )
}

export default App;
