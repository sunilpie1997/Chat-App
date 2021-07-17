import React  from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './components/authentication/auth-context';
import ProtectedRoute from './components/authentication/protected-route';
import Login from './components/authentication/login';
import DashBoard from './components/dashboard';
import LoginRoute from './components/authentication/login-route';
import MatchNotFound from './components/match-not-found';
import { SocketContext, socket } from './components/socket-chat/socket-context';
import Box from '@material-ui/core/Box';

function App() {

  return (

    // <Container maxWidth="xl" className="App" style={{backgroundColor:'gray',paddingTop:'0em'}}>
    <Box className="App">
      <AuthProvider>
          <SocketContext.Provider value={socket}>
          
            <Router>
              <Switch>
          
                <Redirect exact from="/" to="/dashboard" />
                
                {/* <Route exact path="/login" render={props => <Login {...props} />}/> */}
                <LoginRoute exact path="/login" component={Login} />

                <ProtectedRoute path="/dashboard" component={DashBoard} />
                <Route path="*" render={props => <MatchNotFound {...props} />} />

              </Switch>
          
            </Router>
          </SocketContext.Provider>
      </AuthProvider>
    </Box>
    
  )
}

export default App;
