import React, {useContext, useEffect,useState} from 'react';
import Login from './authentication/login';
import Logout from './authentication/logout';
import { AuthContext } from './authentication/auth-context';
import UserDetails from './user/user-details'; 
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {useStyles} from '../styles/style';
import app_logo from '../photos/app-logo.jpg';
import ChatIcon from '@material-ui/icons/Chat';
import FeaturesList from './app-features';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const HomePage = () => {

    const user = useContext(AuthContext).authState.user;

    const classes = useStyles();


    return (
        <React.Fragment>

            <Box style={{paddingTop:'2em'}}>
                <Typography variant="h5" className={classes.text}>Social Connect</Typography>
                <img src={app_logo} className={classes.app_logo}/>
            </Box>
            
            <Box className={classes.intro_box}>
                <Typography variant="h6" className={classes.text}>Welcome to the Social Connect Platform</Typography>
                <FeaturesList/>
            </Box>
        
            <Box className={classes.intro_box}>
                
                <React.Fragment>
                       
                    <UserDetails user={user}/>                           
                       
                    <Box style={{margin:'1em'}}>
                        <Link to="/chat">
                            <ChatIcon color="primary" fontSize="large" style={{padding:'0.25em'}}/>
                        </Link>
                           
                        <Link to="/add_friend">
                            <PersonAddIcon color="primary" fontSize="large" style={{padding:'0.25em'}}/>
                        </Link>
                    
                    </Box>

                    <Box style={{margin:'1em'}}>
                        <Logout/>
                    </Box>  
                       
                </React.Fragment>
            
            </Box>

        </React.Fragment>
    )

}


export default HomePage;