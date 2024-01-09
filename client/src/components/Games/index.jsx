import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Games = () => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    const navigate = useNavigate();
    const [colors, setColors] = useState(["darkslateblue", "darkred", "darkgreen", "darkgoldenrod", "slategray", "navy", "indigo"]);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const [currentUser, setCurrentUser] = useState([]);

    const handleColorChange = () => {
        setCurrentColorIndex((currentColorIndex + 1) % colors.length);
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
            <body>
                <div className={styles.button_container}>
                    <div className={styles.button_wrapper}>
                        <Link to="/games/rockpaperscissors">
                        <button className={styles.game_btn}>
                            Rock Paper scissors
                        </button>
                        </Link>
                        <Link to="/games/tictactoe">
                        <button className={styles.game_btn}>
                            Tic Tac Toe
                        </button>
                        </Link>
                    </div>
                </div>
            </body>
        </div>
    );
};

export default Games;
