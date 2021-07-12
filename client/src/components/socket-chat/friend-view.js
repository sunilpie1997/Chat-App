import React,{useContext} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { StyledBadge } from '../../styles/style'; 
import { ChatFriendUpdaterContext } from './chat-friend-context';

const FriendView = (props) => {

    const { friend } = props;
    
    const setChatFriend = useContext(ChatFriendUpdaterContext);

    const onSelectFriend = () => {

        setChatFriend(friend);
    }

    const getColorForStatus = () => {

        if(friend.status)
        return '#44b700';

        return "#93ABD3";
    }

    return (

        <React.Fragment>
            <ListItem button onClick={onSelectFriend}>
                <ListItemAvatar>
                
                    <StyledBadge
                        overlap="circle"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                            }}
                        variant="dot"
                        colorTheme={getColorForStatus()}
                    >
                        <Avatar alt={friend.fullName} src={friend.photoUrl} />
                    </StyledBadge>
                
                </ListItemAvatar>
                <ListItemText primary={friend.fullName} secondary={friend.email} />
            </ListItem>
        </React.Fragment>

    )


}


export default FriendView;