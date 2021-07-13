import React,{ useState, useEffect, useContext} from 'react';
import Message from './message';
import Box from '@material-ui/core/Box';
import SendMessageBox from './send-message-box';
import { useStyles } from '../../styles/style';
import { ChatFriendStateContext } from './chat-friend-context';
import { MessageHistoryStateContext } from './message-history-context';

const MessagePanel = () => {

    const classes = useStyles();

    const chatFriend = useContext(ChatFriendStateContext);

    const messageHistory = useContext(MessageHistoryStateContext);

    const messageEndRef = React.createRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    

    const filterMessages = (message) => {

        if( chatFriend && ((message.from === chatFriend.googleId) || (message.to === chatFriend.googleId)) )
        return true;
        
        // if no friend selected, show no message
        return false;
    }

    return (

        <React.Fragment>
            <Box className={classes.message_history_box}>

                {   // add filter to display only particular friend message
                    messageHistory.filter(filterMessages).map((message) => {

                        return <Message message={message} key={message.id}/>
                    })
                }

            </Box>
            <Box className={classes.send_message_box}>
                <SendMessageBox/>
            </Box>
            
            <div id="messageEnd" ref={messageEndRef}>

            </div>
        </React.Fragment>
    );

}


export default MessagePanel;