import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider"
import {getSender} from "./config/ChatLogic"
import GroupChatModal from './Miscellaneuos/GroupChatModal';

const MyChats = ( fetchAgain) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try{

      const config = {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const url = `http://localhost:8080/api/chat`;

      const { data} = await axios.get(url, config);
      //console.log(data);
      setChats(data);
      //console.log(selectedChat);
    }catch(error){
      console.log(error);
    }

  }

  useEffect(() => {
    //console.log(localStorage.getItem("token"));
    setLoggedUser(localStorage.getItem("token"));
    //console.log(loggedUser);
    fetchChats();
  }, [] ) // might have to include fetchAgain here


  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '10px', // Adjust padding as needed
      backgroundColor: '#F8F8F8',
      width: '100%',
      height: 'auto',
      
      maxWidth: '320px',
      borderRadius: '8px', // Corresponds to 'lg' in ChakraUI
      overflowY: 'auto',
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <p>My Chats</p>
        <GroupChatModal>
        {(openModal) => (
            <button
              onClick={() => {
                // Handle the logic for creating a new group chat
                // This could involve opening a modal or navigating to a new page
                //console.log('Create New Group Chat');
                openModal();
              }}
              style={{
                cursor: 'pointer',
                backgroundColor: '#38B2AC',
                color: 'white',
                borderRadius: '8px',
                padding: '10px',
                border: 'none',
              }}
            >
              New Group Chat
            </button>
        )}
        </GroupChatModal>
      </div>
      {chats && (
        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '2px', // Adjust padding as needed
          backgroundColor: '#F8F8F8',
          width: '100%',
          height: '260px',
          borderRadius: '8px', // Corresponds to 'lg' in ChakraUI
          overflowY: 'auto',
        }}
        >
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {chats.map((chat) => (
              <li
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedChat === chat ? '#38B2AC' : '#E8E8E8',
                  color: selectedChat === chat ? 'white' : 'black',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '15px',
                  border: '1px solid #ccc', // Add border for a box-like structure
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold' }}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                  </span>
                  {chat.latestMessage && (
                    <div style={{ fontSize: 'xs'}}>
                      <span>{chat.latestMessage.sender.name}:</span>
                      <span>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + '...'
                          : chat.latestMessage.content}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>


  )
}

export default MyChats
