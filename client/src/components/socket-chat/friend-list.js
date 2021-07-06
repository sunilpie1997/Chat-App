import React from 'react';
import FriendView from './friend-view';
import List from '@material-ui/core/List';

const FriendList = (props) => {


    const friendList = props.friendList;

    return (

        <React.Fragment>
            <List>
            {
                friendList.map( (friend) => {
                    
                    return <FriendView key={friend.googleId} friend={friend}/>
                            
                } )
            }
             </List>
        </React.Fragment>

    )

}


export default FriendList;