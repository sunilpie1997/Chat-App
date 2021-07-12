import React, { useContext, useEffect, useState } from 'react';
import { AuthStateContext } from '../authentication/auth-context';
import UserAvatar from '../user/user-avatar';
import {Link, useRouteMatch} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import {useStyles} from '../../styles/style';
import Box from '@material-ui/core/Box';
import HomeIcon from '@material-ui/icons/Home';
import FriendList from './friend-list';
import { getFriendList } from '../../services/friends-service'
import AlertMessage from '../../utils/alerts';
import Snackbar from '@material-ui/core/Snackbar';
import MessagePanel from './MessagePanel';
import { ChatFriendStateContext } from './chat-friend-context';
import { SocketContext } from './socket';

const ChatComponent = () => {

    const { user } = useContext(AuthStateContext);

    const chatFriend = useContext(ChatFriendStateContext);
   
    const socket = useContext(SocketContext);

    const [friendList, setFriendList] = useState([]);
    const [socketStatus, setSocketStatus] = useState(false);

    /************** for alerts (success and failure) ***********/
    const [open,setOpen] = useState(false);
    const [message,setMessage] = useState('');
    const [error, setError] = useState(false);
    /************************************************************/

    const classes = useStyles();

    const setFriendStatusToOffline = (googleId) => {
        
        setFriendList(prev => prev.map(friend => friend.googleId == googleId ? {...friend,status:0} : friend ));
    }

    const setFriendStatusToOnline = (googleId) => {
        
        setFriendList(prev => prev.map(friend => friend.googleId == googleId ? {...friend,status:1} : friend ));
    }

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

        let intervalId = setInterval(setSocketStatusProperty,1000);
        
        socket.on('LEAVE',setFriendStatusToOffline);
        socket.on('JOIN', setFriendStatusToOnline);
        
        const fetchFriends = async () => { 
        
                const apiResp = await getFriendList();
                if(!apiResp.error)
                {
                    setFriendList(apiResp.data);
                }
                else
                {
                    setOpen(true);
                    setMessage(apiResp.message);
                    setError(true);
                }
        }
        fetchFriends();

        return () => { 
            socket.off('LEAVE',setFriendStatusToOffline);
            socket.off('JOIN', setFriendStatusToOnline);
            if(intervalId) clearInterval(intervalId);
        }

    },[]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    return (
        <Box>
            
                {/***************************** alerts on error and success *****************************/}    
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                {
                    error ? (
                               <AlertMessage onClose={handleClose} severity="error">{message}</AlertMessage>
                            ):
                            (
                                <AlertMessage onClose={handleClose} severity="success">{message}</AlertMessage>
                            )
                }
                </Snackbar>
                    
                {/*****************************************************************************************/}
                 
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
                    <FriendList friendList={friendList}/>

                </Box>
                
        </Box>
    )



}

export default ChatComponent;