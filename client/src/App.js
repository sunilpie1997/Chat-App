import React, { useEffect } from 'react';
import './App.css';
import { useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './components/authentication/auth-context';
import Container from '@material-ui/core/Container';
import ProtectedRoute from './components/authentication/protected-route';
import Login from './components/authentication/login';
import DashBoard from './components/dashboard';
import MatchNotFound from './components/match-not-found';
import { SocketContext, socket } from './components/socket-chat/socket-context';

function App() {

  return (

    <Container maxWidth="xl" className="App">
  
      <AuthProvider>
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
      </AuthProvider>
    </Container>
    
  )
}

export default App;
