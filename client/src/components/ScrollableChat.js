import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
  } from "../components/config/ChatLogic";

import { ChatState } from "../context/chatProvider";

const ScrollableChat = ({messages}) => {
    const { user } = ChatState();

    const [currentUser, setCurrentUser] = useState([]);

    useEffect(() => {
      

      const handleUser = () => {
        const config = {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
  
        try{
          axios.get(`http://localhost:8080/api/users/user`, config)
          .then((response) => {
            setCurrentUser(response.data);
            //console.log(response.data);
        })
          
        }catch (error) {
          console.error('Error adding user follower:', error);
        }
        
      }
  
      handleUser();
    });

  return (
    <div>
      {messages && messages.map((m) => (
        <div style={{ display: "flex" }} key={m._id}>
            {/* {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && ( */}
                {(m.sender._id != currentUser._id) &&
                <label style={{fontSize: "10px"}}>
                  {m.sender.firstName}
                  </label>
                  }
              <span
              style={{
                backgroundColor: `${
                  m.sender._id === currentUser._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: (m.sender._id != currentUser._id) ? 3 : 'auto',
                marginTop: (m.sender._id != currentUser._id) ? 10 : 3,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
        </div>
      ))}
    </div>
  )
}

export default ScrollableChat
