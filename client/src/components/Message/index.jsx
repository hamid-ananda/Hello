import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";


import { ChatState } from "../../context/chatProvider";
import SearchBar from "../Miscellaneuos/SearchBar";
import MyChats from "../MyChats";
import ChatBox from "../ChatBox";



const Message = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };
  
  const [colors, setColors] = useState(["darkslateblue", "darkred", "darkgreen", "darkgoldenrod", "slategray", "navy", "indigo"]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState([]);

  const handleColorChange = () => {
    setCurrentColorIndex((currentColorIndex + 1) % colors.length);
  };

  const [fetchAgain, setFetchAgain] = useState(false); // used to refresh chats 
  const { user } = ChatState();



  const handleAnonymous = () => {
    const config = {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try{
      axios.get(`http://localhost:8080/api/users/toggleHidden`, config)
      console.log("yes");
    }catch (error) {
      console.error('Error adding user follower:', error);
    }
    
  }

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
  //console.log(user);

  return (
    <div>
      <nav className={`${styles.navbar}`} style={{ backgroundColor: colors[currentColorIndex] }}>
        <h1>Hello</h1>
        <Link to="/games">
          <button type="button" className={styles.white_btn}>
            Games
          </button>
        </Link>
        <Link to="/message">
          <button type="button" className={styles.white_btn}>
            Messaging
          </button>
        </Link>
        <Link to="/videocall">
          <button type="button" className={styles.white_btn}>
            Video Call
          </button>
        </Link>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
        <button className={styles.white_btn} onClick={handleColorChange}>
          Change Color
        </button>
        <button className={(currentUser.isHidden) ? styles.black_btn : styles.white_btn} onClick={handleAnonymous}>
          Toggle Anonymity
        </button>
      </nav>
      
      <div style={{ display: "flex"}}>
        <div>
          {user && <SearchBar/>}
          {user && <MyChats fetchAgain={fetchAgain}/>} 
        </div>
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>} 
        
        
      </div>
    </div>
  );
};

export default Message;