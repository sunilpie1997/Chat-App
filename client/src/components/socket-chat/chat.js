import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../authentication/auth-context';
import UserAvatar from '../user/user-avatar';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import {useStyles} from '../../styles/style';
import Box from '@material-ui/core/Box';
import HomeIcon from '@material-ui/icons/Home';
import FriendList from './friend-list';
import { getFriendList } from '../../services/friends-service'
import AlertMessage from '../../utils/alerts';
import Snackbar from '@material-ui/core/Snackbar';
import MessagePanel from './MessagePanel';
import { ChatFriendContext } from './chat-friend-context';
import { SocketContext } from './socket';

const ChatComponent = () => {

    const authContext = useContext(AuthContext);
    const user = authContext.loggedInUser.user;

    const chatFriendContext = useContext(ChatFriendContext);
    const friend = chatFriendContext.chatFriend.user;
   
    const socket = useContext(SocketContext);

    const [friendList, setFriendList] = useState([]);
    const [ unAuthorized, setUnAuthorised] = useState(true);
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

        let intervalId;
        const fetchFriends = async () => { 
            if(user)
            {
                socket.on('LEAVE',setFriendStatusToOffline);
                socket.on('JOIN', setFriendStatusToOnline);
                // check every 10 seconds
                intervalId = setInterval(setSocketStatusProperty,1000);

                setUnAuthorised(false);
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
            else
            {
                setUnAuthorised(true);
            }
        }
        fetchFriends();

        return () => { 
            socket.off('LEAVE',setFriendStatusToOffline);
            socket.off('JOIN', setFriendStatusToOnline);
            if(intervalId) clearInterval(intervalId);
        }

    },[user]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    return (
        <Box>
            {unAuthorized ? (
                <Typography variant="h5" className={classes.text}>Please Login</Typography>
            ) :(
                <React.Fragment>

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
                    
                        <Link to="/">
                            <UserAvatar photoUrl={user.photoUrl} status={socketStatus} fullName={user.fullName}/>
                        </Link>

                        {  

                        friend ? (
                                <AlertMessage severity="info">You are chatting with&nbsp;{friend.fullName}</AlertMessage>
                            ):
                            (
                                    <AlertMessage severity="warning">Please select your friend</AlertMessage>
                            )
                        }
                    </Box>
                        
                    <Box className={classes.message_box}>
                        <MessagePanel/>
                    </Box>
                        
                    <Box className={classes.friends_box}>
                        <FriendList friendList={friendList}/>

                    </Box>
                
                </React.Fragment>
                )
            }
        </Box>
    )



}

export default ChatComponent;