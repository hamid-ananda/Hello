import React, { useEffect } from 'react'
import styles from './Sidedrawer.module.css';
import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/chatProvider"

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("");
    const [friends, setFriends] = useState([]);

    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
      } = ChatState();

    const handleSearch = async () => {
        if (!search) {
            // Handle empty search
            return;
        }

            try{
                setLoading(true);

                //console.log(localStorage.getItem("token"));

                const config = {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                };

                const url = `http://localhost:8080/api/users?search=${search}`;
                //console.log('Request URL:', url);

                const { data} = await axios.get(url, config);

                setLoading(false);
                setSearchResult(data);
            }catch(error) {
                // Handle errors
            }
        }


    // const handleSearch = async () => {
    //     if (!search) {
    //         // Handle empty search
    //         return;
    //     }

    //         try{
    //             setLoading(true);

    //             //console.log(localStorage.getItem("token"));

    //             const config = {
    //                 headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                 },
    //             };

    //             const url = `http://localhost:8080/api/friends/findFriends?search=${search}`;
    //             //console.log('Request URL:', url);

    //             const { data} = await axios.get(url, config);
    //             console.log(data);

    //             setLoading(false);
    //             setSearchResult(data.matchingFriends);
    //         }catch(error) {
    //             // Handle errors
    //         }
    //     }
    const handleUserFollowers = async () => {
        const config = {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        // current user friends list
        axios.get(`http://localhost:8080/api/friends`, config)
        .then((response) => {
            setFriends(response.data.friends); 
            setCurrentUserId(response.data.userId);
            //console.log(response.data.requests);
        })
        .catch((error) => {
            console.error('Error fetching user friends:', error);
        });
    }

    const handleAddFollower = async (followerId) => {
        try {
            await axios.put(`http://localhost:8080/api/friends/addFriend?userId=${currentUserId}&friendId=${followerId}`);
            handleUserFollowers(); // Update friends after successfully adding follower
          } catch (error) {
            console.error('Error adding user follower:', error);
          }
    }

    const handleRemoveFollower = async (followerId) => {
        try {
            await axios.put(`http://localhost:8080/api/friends/removeFriend?userId=${currentUserId}&friendId=${followerId}`);
            handleUserFollowers(); // Update friends after successfully removing follower
          } catch (error) {
            console.error('Error removing user follower:', error);
          }
    }



    const accessChat = async (userId) => {
        //console.log(userId);

        try{
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };

            const url = `http://localhost:8080/api/chat`;
                //console.log('Request URL:', url);

            const { data} = await axios.post(url, {userId}, config);
            
            //console.log(data);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            
            setSelectedChat(data);
            setLoadingChat(false);
        }catch(error){
            console.log(error);
        }
    }

    
    return (
        <div className={styles.searchBarWrapper}>
            <div className={styles.SearchBar}>
                <h3>Search For A User</h3>
                <div className={styles.searchbarcontainer}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.search_input}
                    />
                    <button onClick={() => {handleSearch(); handleUserFollowers();}} className={styles.search_button}>
                        Search
                    </button>
                </div>
                {loading && <p>Loading...</p>}
                {searchResult.length > 0 && (
                    <div>
                    <p>Search Result:</p>
                    {/* <pre>{JSON.stringify(searchResult, null, 2)}</pre> */}
                    <ul className={styles.userList} onChange={handleUserFollowers}>
                        {searchResult.map((user) => (
                        <li 
                        key={user._id} 
                        className={(friends.some(friend => friend._id === user._id)) ? styles.userFollower : styles.userItem} 
                        >
                            <div>
                                {user.isHidden ? (
                                    <div>    
                                        <div>
                                        <strong>?</strong>
                                        </div>
                                    </div>
                                ) : (
                                <div>    
                                    <div>
                                    <strong>Name:</strong> {`${user.firstName}`}
                                    </div>
                                    <div>
                                    <strong>Email:</strong> {user.email}
                                    </div>
                                </div>
                                )}
                            </div>
                            {(friends.some(friend => friend._id === user._id)) ? (
                                <button onClick={() =>{handleRemoveFollower(user._id)}}>
                                    unfollow
                                </button>
                            ) : (
                                <button onClick={() =>{handleAddFollower(user._id)}}>
                                    Follow
                                </button>
                            )}
                            <button onClick={() => {accessChat(user._id)}}>
                                Open Chat
                            </button>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
            </div>
        </div>
      );
}

export default SearchBar
