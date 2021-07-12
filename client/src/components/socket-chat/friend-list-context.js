import React, { useEffect, useState, useContext } from "react";
import { getFriendList } from '../../services/friends-service'
import { SocketContext } from './socket-context';


export const FriendListStateContext = React.createContext();

export const FriendListUpdaterContext  = React.createContext();


export const FriendListProvider = ({children}) => {

    const [friendList, setFriendList] = useState([]);
    const socket = useContext(SocketContext);


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
                // setOpen(true);
                // setMessage(apiResp.message);
                // setError(true);
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


    return  (
        <FriendListStateContext.Provider value={friendList}>
            <FriendListUpdaterContext value = {setFriendList}>
                {children}
            </FriendListUpdaterContext>
        </FriendListStateContext.Provider>
    )

}