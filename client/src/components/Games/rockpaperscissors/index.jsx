import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import './index.css';
import RockPaperScissors from './RockPaperScissors';

const Rockpaperscissors = () => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    const navigate = useNavigate();
    const [colors, setColors] = useState(["darkslateblue", "darkred", "darkgreen", "darkgoldenrod", "slategray", "navy", "indigo"]);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const handleColorChange = () => {
        setCurrentColorIndex((currentColorIndex + 1) % colors.length);
    };

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
            </nav>
            <body>
                <h1>
                    <RockPaperScissors/>
                </h1>
            </body>
        </div>
    );
};

export default Rockpaperscissors;
