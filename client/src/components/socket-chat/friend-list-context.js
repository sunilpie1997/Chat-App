import React, { useEffect, useState, useContext } from "react";
import { getFriendList } from '../../services/friends-service'
import { SocketContext } from './socket-context';
import AlertMessage from '../../utils/alerts';
import Snackbar from '@material-ui/core/Snackbar';

export const FriendListStateContext = React.createContext();

export const FriendListUpdaterContext  = React.createContext();


export const FriendListProvider = ({children}) => {

    const [friendList, setFriendList] = useState([]);
    const socket = useContext(SocketContext);

    /************** for alerts (success and failure) ***********/
    const [open,setOpen] = useState(false);
    const [message,setMessage] = useState('');
    const [error, setError] = useState(false);
    /************************************************************/

    useEffect(() => {

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
        }

    },[]);


    const setFriendStatusToOffline = (googleId) => {
        
        setFriendList(prev => prev.map(friend => friend.googleId == googleId ? {...friend,status:0} : friend ));
    }

    const setFriendStatusToOnline = (googleId) => {
        
        setFriendList(prev => prev.map(friend => friend.googleId == googleId ? {...friend,status:1} : friend ));
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };


    return  (
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
        
            <FriendListStateContext.Provider value={friendList}>
                <FriendListUpdaterContext.Provider value = {setFriendList}>
                    {children}
                </FriendListUpdaterContext.Provider>
            </FriendListStateContext.Provider>
        </React.Fragment>
    )

}