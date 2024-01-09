import React from 'react'
import { ChatState } from '../context/chatProvider'
import { useEffect, useState } from "react";
import { getSender, getSenderFull } from "./config/ChatLogic";
import UpdateGroupChatModal from './Miscellaneuos/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';



const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();


    const fetchMessages = async () => {
        if (!selectedChat) return;

        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `http://localhost:8080/api/message/${selectedChat._id}`,
                config
            );

            
            setMessages(data);
            console.log(messages);
            setLoading(false);

        }catch(error){
            console.error(error);
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);


    }

    const sendMessage = async(event) => {
        
        if (event.key === 'Enter' && newMessage) {
    
          try{
            const config = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };
    
            const url = `http://localhost:8080/api/message`;
            setNewMessage("");
            const { data } = await axios.post(
                url,
                {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, 
                config
            );

            //console.log(data);

            
            setMessages([...messages, data]);
          }catch(error){
            console.error(error);
          }
          // Add your logic to send the message here
          
        }
      };


      useEffect(() => {
        fetchMessages();
    
        //selectedChatCompare = selectedChat;
        // eslint-disable-next-line
      }, [selectedChat]);

  
    return (
        <div style={{
            width: "100%",
            height: "100%"
        }}>
        {selectedChat ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{
                    fontSize: { base: "28px", md: "30px" },
                    paddingRight: 5,
                    paddingLeft: 5,
                    
                    display: selectedChat ? "flex" : "none", 
                }}>
                    <div style={{width: "100%", display: 'flex',flexWrap: 'wrap', justifyContent: "space-between"}}>
                        {!selectedChat.isGroupChat ? (
                            <div>
                                <h2>{getSender(user, selectedChat.users)}</h2>
                            </div>
                        ) : (
                            <h2>{selectedChat.chatName}</h2>
                            
                        )}
                        {/* <UpdateGroupChatModal
                            // fetchMessages={fetchMessages}
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain}
                        /> */}
                        <button onClick={() => setSelectedChat("")}>Exit</button>
                    </div>
                </div>
                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "12px",
                    backgroundColor: "#E8E8E8",
                    width: "auto",
                    flex: "1",
                    borderRadius: "8px",
                    overflowY: "hidden"
                }}
                >
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div style={{display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'scroll',
                            scrollbarWidth: 'none'}}>
                            <ScrollableChat messages={messages} />
                        </div>
                    )}
                    <div style={{width: '100%' }}>
                    {/* <label htmlFor="first-name">First Name</label> */}
                        <input
                            type="text"
                            id="first-name"
                            placeholder='Enter Message'
                            value={newMessage}
                            onChange={typingHandler}
                            onKeyDown={sendMessage}
                            required
                            style={{ marginTop: '1rem', width: "100%", height: "20px" }} // Add custom styling if needed
                        />
                    </div>
                </div>
            </div>
        ) : (
            <h2>Please select a chat to view its details.</h2>
        )}
        </div>
    )
}

export default SingleChat
