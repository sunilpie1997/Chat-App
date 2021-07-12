import React, { useContext, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Box from '@material-ui/core/Box';
import { useStyles } from '../../styles/style';
import { AuthStateContext } from '../authentication/auth-context';
import { ChatFriendStateContext } from './chat-friend-context';
import { SocketContext } from './socket';

const SendMessageBox = (props) => {

    const pushMessage = props.pushMessage;

    const { user } = useContext(AuthStateContext);

    const chatFriend = useContext(ChatFriendStateContext);

    const socket = useContext(SocketContext);

    const [chat, setChat] = useState('');

    const classes = useStyles();

    const sendChat = () => {
        
        if(!chat.trim()) return;

        if(chatFriend)
        {   
            const message = {from:user.googleId, to:chatFriend.googleId, content:chat,time : Date.now()};
            socket.emit('PM',message);
            pushMessage(message);
        }
    }

    return (
        <React.Fragment>

            <Box>
                <TextField className={classes.send_text_div}
                    id="standard-multiline-flexible"
                    label="type message"
                    multiline
                    fullWidth
                    rowsMax={2}
                    value={chat}
                    onChange={(e)=>setChat(e.target.value)}
                    size="medium"
                />
            </Box>

            <Box className={classes.send_icon_div}>
                <Fab color="secondary" size="small" onClick={sendChat}>
                    <SendIcon/>
                </Fab>
            </Box>
        </React.Fragment>
    );
}

export default SendMessageBox;