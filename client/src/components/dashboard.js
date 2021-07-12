import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch} from 'react-router-dom';
import HomePage from './home/HomePage';
import ChatComponent from './socket-chat/chat';
import SearchFriend from './socket-chat/search-friend';
import Box from '@material-ui/core/Box';
import { ChatFriendProvider } from './socket-chat/chat-friend-context';
import { FriendListProvider } from './socket-chat/friend-list-context';


const DashBoard = () => {

    let { path, url } = useRouteMatch();


    return (
        <Box>
            <ChatFriendProvider>
                <FriendListProvider>
                    <Switch>
                        <Route exact path={path} render={ props => <HomePage {...props} /> } />
                        <Route exact path={`${path}/chat`} render={ props => <ChatComponent {...props} /> } />
                        <Route exact path={`${path}/add_friend`} render={ props => <SearchFriend {...props} /> } />
                    </Switch>
                </FriendListProvider>
            </ChatFriendProvider>
            
        </Box>
    )
    
}

export default DashBoard;