import React from "react";

export const ChatFriendContext = React.createContext();

//maintains current friend with whom user is chatting/view messages (based on selection)
export const chatUserState = {
    user:null
  
  }

export const chatFriendReducer = (state, action) => {
  
    switch(action.type)
    {
      case 'change_friend':
        return { user: action.value }
    }
  }