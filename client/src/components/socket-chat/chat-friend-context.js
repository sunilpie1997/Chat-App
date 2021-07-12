import React, { useState } from "react";

export const ChatFriendStateContext = React.createContext();

export const ChatFriendUpdaterContext = React.createContext();


//maintains current friend with whom user is chatting/view messages (based on selection)
export const ChatFriendProvider = ({children}) => {

  const [chatFriend, setChatFriend] = useState(null);

  return (
    <ChatFriendStateContext.Provider value={chatFriend}>
      <ChatFriendUpdaterContext.Provider value={setChatFriend}>
        {children}
      </ChatFriendUpdaterContext.Provider>
    </ChatFriendStateContext.Provider>
  )
}