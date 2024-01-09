import React from 'react'
import { ChatState } from '../context/chatProvider'
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
    style={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      padding: "12px",
      backgroundColor: "white",
      width: "100%",
      borderRadius: "8px",
      borderWidth: "1px",
    }}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default ChatBox;
