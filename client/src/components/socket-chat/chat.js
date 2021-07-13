import React, { useContext, useEffect, useState } from 'react';
import { AuthStateContext } from '../authentication/auth-context';
import UserAvatar from '../user/user-avatar';
import {Link, useRouteMatch} from 'react-router-dom';
import {useStyles} from '../../styles/style';
import Box from '@material-ui/core/Box';
import FriendList from './friend-list';
import AlertMessage from '../../utils/alerts';
import MessagePanel from './MessagePanel';
import { ChatFriendStateContext } from './chat-friend-context';
import { SocketContext } from './socket-context';


const ChatComponent = () => {

    const { user } = useContext(AuthStateContext);

    const chatFriend = useContext(ChatFriendStateContext);
   
    const socket = useContext(SocketContext);

    const [socketStatus, setSocketStatus] = useState(false);

    const classes = useStyles();


    const setSocketStatusProperty = () => {

        if(socket.connected)
        {
            setSocketStatus(true)
        }
        else
        {
            setSocketStatus(false);
        }
    }

    useEffect(() => {

        let intervalId = setInterval(setSocketStatusProperty,100);

        return () => { 
            if(intervalId) clearInterval(intervalId);
        }

    },[]);

    return (
        <React.Fragment>
                 
                <Box className={classes.info_message}>
                    
                    <Link to="/dashboard">
                        <UserAvatar photoUrl={user.photoUrl} status={socketStatus} fullName={user.fullName}/>
                    </Link>

                    {  

                        chatFriend ? (
                                    <AlertMessage severity="info">You are chatting with&nbsp;{chatFriend.fullName}</AlertMessage>
                                ):
                                (
                                    <AlertMessage severity="warning">Please select your friend</AlertMessage>
                                )
                    }
                   
                </Box>
                        
                <Box className={classes.message_panel_box}>
                    <MessagePanel/>
                </Box>
                        
                <Box className={classes.friends_box}>
                    <FriendList/>

                </Box>
                
        </React.Fragment>
    )



}

export default ChatComponent;