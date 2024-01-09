import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Tictactoe = () => {
    const [socket, setSocket] = useState(null);
    const [role, setRole] = useState(false);
    const [canPlay, setCanPlay] = useState(true);
    const [xo, setXo] = useState([]);
    const [winner, setWinner] = useState("");

    useEffect(() => {
        const newSocket = io(`http://localhost:8080`);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("CanJoin", (gameResponse) => {
                setCanPlay(gameResponse);
            });
            socket.on("Role", (gameResponse) => {
                setRole(gameResponse);
            });
            socket.on("xo", (gameResponse) => {
                setXo(gameResponse);
            });
            socket.on("winner", (gameResponse) => {
                setWinner(gameResponse);
            });
        }
    }, [socket]);

    const select = (x, y) => {
        console.log("hello");
        socket.emit("Turn", { x, y, role });
    };

    const reloadTab = () => {
        window.location.reload();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    const navigate = useNavigate();
    const [colors, setColors] = useState([
        "darkslateblue",
        "darkred",
        "darkgreen",
        "darkgoldenrod",
        "slategray",
        "navy",
        "indigo",
    ]);
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
                <div>
                    {!role && canPlay ? <h1 className={styles.h1}>Waiting for New User</h1> : null}
                    {role ? (
                        <div>
                            <h1 className={styles.h1}>Your Playing is {role}</h1>
                            <h2>{winner === "" ? "" : `The winner is ${winner}`}</h2>
                            <div className={styles.game}>
                                {xo.map((line, x) => {
                                    return (
                                        <div key={x} className={styles.line}>
                                            {line.map((col, y) => {
                                                return (
                                                    <div
                                                        key={y}
                                                        className={styles.colonne}
                                                        onClick={() => {
                                                            select(x, y);
                                                        }}
                                                    >
                                                        {col}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={styles.centering}>
                            <button className={styles.purple_btn} onClick={reloadTab}>
                                Reset Game
                            </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </body>
        </div>
    );
};

export default Tictactoe;
