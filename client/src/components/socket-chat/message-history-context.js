import React,{useContext, useState, useEffect} from 'react';
import { SocketContext } from './socket-context';

export const MessageHistoryStateContext = React.createContext();

export const MessageHistoryUpdaterContext = React.createContext();


export const MessageHistoryProvider = ({children}) => {

    const socket = useContext(SocketContext);

    const [messageHistory, setMessageHistory] = useState([]);

    const pushMessage = ({from,to,content,time}) => {
  
        setMessageHistory(prev => [
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

        socket.on('PM', receiveMessageListener);

        return () => socket.off('PM', receiveMessageListener);
    });

    const receiveMessageListener = (message) => pushMessage(message);

    return (
        <MessageHistoryStateContext.Provider value={messageHistory}>
            <MessageHistoryUpdaterContext.Provider value={pushMessage}>
                {children}
            </MessageHistoryUpdaterContext.Provider>
        </MessageHistoryStateContext.Provider>
    );

}