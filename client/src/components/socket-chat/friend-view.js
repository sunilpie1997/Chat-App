import React,{useContext} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { StyledBadge } from '../../styles/style'; 
import { ChatFriendContext } from './chat-friend-context';

const FriendView = (props) => {

    const {email,photoUrl,fullName,status} = props.friend;
    
    const chatFriendContext = useContext(ChatFriendContext);

    const onSelectFriend = () => {

        chatFriendContext.setChatFriend({ type:'change_friend', value:props.friend })
    }

    const getColorForStatus = () => {

        if(status)
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
                        <Avatar alt={fullName} src={photoUrl} />
                    </StyledBadge>
                
                </ListItemAvatar>
                <ListItemText primary={fullName} secondary={email} />
            </ListItem>
        </React.Fragment>

    )


}


export default FriendView;