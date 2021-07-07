import React,{ useState, useEffect, useContext} from 'react';
import Message from './message';
import Box from '@material-ui/core/Box';
import SendMessageBox from './send-message-box';
import { useStyles } from '../../styles/style';
import { ChatFriendContext } from './chat-friend-context';
import { SocketContext } from './socket';

const MessagePanel = () => {

    const classes = useStyles();

    const chatFriendContext = useContext(ChatFriendContext);
    const friend = chatFriendContext.chatFriend.user;

    const socket = useContext(SocketContext);

    const [allMessages,setAllMessages] = useState([]);
    const messageEndRef = React.createRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    
    const receiveMessageListener = (message) => pushMessage(message);
    
    const pushMessage = ({from,to,content,time}) => {
  
        setAllMessages(prev => [
            ...prev,
            {
  
                id : prev.length,
                from : from,
                to : to,
                time : time,
                content : content
            }
        ]);
    }      
    
    useEffect(() => {

        scrollToBottom();
    }, [allMessages]);

    
    useEffect(() => {

        socket.on('PM', receiveMessageListener);

        return () => socket.off('PM', receiveMessageListener);
    });

    
    

    const filterMessages = (message) => {

        if( friend && ((message.from === friend.googleId) || (message.to === friend.googleId)) )
        return true;
        
        // if no friend selected, show no message
        return false;
    }

    return (

        <React.Fragment>
            <Box className={classes.message_history_box}>

                {   // add filter to display only particular friend message
                    allMessages.filter(filterMessages).map((message) => {

                        return <Message message={message} key={message.id}/>
                    })
                }

            </Box>
            <Box className={classes.send_message_box}>
                <SendMessageBox pushMessage={pushMessage}/>
            </Box>
            
            <div id="messageEnd" ref={messageEndRef}>

            </div>
        </React.Fragment>
    );

}


export default MessagePanel;