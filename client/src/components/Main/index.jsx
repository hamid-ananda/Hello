import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Main = () => {

    const [currentUser, setCurrentUser] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

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

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
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
                <button className={(currentUser.isHidden) ? styles.black_btn : styles.white_btn} onClick={handleAnonymous}>
                    Toggle Anonymity
                </button>
            </nav>

            {/* Homepage Layout */}
            <div className={styles.homepage}>
                <div className={styles.homepage_box}>
                    <h1>Welcome to Hello!</h1>
                    <p>This is a project made by Group 36 to provide you more oppertunities to communicate with friends!</p>
                    <p>Play Games!</p>
                    <p>Message Friends!</p>
                    <p>Video Call!</p>
                    <p>Click on the buttons above to start</p>

                </div>
            </div>
        </div>
    );
};

export default Main;