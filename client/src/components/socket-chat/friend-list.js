import React,{useContext} from 'react';
import FriendView from './friend-view';
import List from '@material-ui/core/List';
import { FriendListStateContext } from './friend-list-context';

const FriendList = () => {

    const friendList = useContext(FriendListStateContext);


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