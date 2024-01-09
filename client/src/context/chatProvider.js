import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState();

    const history = useNavigate(); // newer react versions replace userHistory with userNavigate

    useEffect(() => {
        

        const userInfo = localStorage.getItem("token");
        setUser(userInfo);

        //if (!userInfo) window.location = "/login";
    }, []);



    return ( <ChatContext.Provider 
            value={{
                user, 
                setUser, 
                selectedChat, 
                setSelectedChat, 
                notification,
                setNotification,
                chats,
                setChats}}>
        {children}
    </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};


export default ChatProvider;