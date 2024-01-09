import React from 'react'
import { useEffect, useState } from "react";
import { ChatState } from '../../context/chatProvider';
import axios from "axios";

const GroupChatModal = ({children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setGroupChatName("");
        setSearch("");
        setSearchResult([]);
        setSelectedUsers([]);
        setIsModalOpen(false);
    };

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    

    const { user, chats, setChats } = ChatState();

    const handleCreateGroupChat = () => {
        // Implement logic to create the group chat with the provided inputs
        console.log('Creating Group Chat:', groupChatName, selectedUsers);
        closeModal();
      };



    const handleSearch = async (query) => {
      console.log(search); 
      setSearch(query);
      if (query === '') {
        setSearch('');
        setSearchResult([]);
        return;
      }

      try{
        setLoading(true);
        const config = {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        
        const url = `http://localhost:8080/api/users?search=${query}`; // for some reason this only works when set to query
                                                                      // the search user state has this weird input delay
                //console.log('Request URL:', url);

        const { data} = await axios.get(url, config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
      }catch(error){
        setLoading(false);
        console.error(error);
      }
    };

    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        console.log("Please fill all the feilds"); 
        return;
      }

      try{
        const config = {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const { data } = await axios.post(
          `http://localhost:8080/api/chat/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        closeModal();
        console.log("groupchat created");
      }catch(error){
        console.error(error);
      }
    }

    //////

    const handleUserClick = (user) => {
      const userExists = selectedUsers.find((selectedUser) => selectedUser._id === user._id);
      if (!userExists) {
        const updatedUsers = [...selectedUsers, user];
        setSelectedUsers(updatedUsers);
      }
    };
  
    const removeSelectedUser = (user) => {
      const updatedUsers = selectedUsers.filter((selectedUser) => selectedUser._id !== user._id);
      setSelectedUsers(updatedUsers);
    };


  return (
    <div>
      {children(openModal)}
      {isModalOpen && (
        <div>
          {/* Dim overlay */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: '998',
            }}
          ></div>
          {/* Modal */}
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999', borderRadius: '8px' }}>
            {/* Fixed header */}
            <div style={{ position: 'sticky', top: 0, padding: '20px', background: '#fff', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
              <h2>Create New Group Chat</h2>
              {/* Input for group name */}
              <label>
                Group Name:
                <input type="text" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
              </label>
              <br />
              {/* Input for users to add */}
              <label>
                Users to Add (comma-separated):
                <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} />
              </label>
              <br />
              {/* Selected users */}
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selectedUsers.map((user) => (
                  <div key={user._id} style={{ padding: '4px', margin: '4px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '12px', display: 'flex' }}>
                    <p>{user.firstName} {user.lastName}</p>
                    <button style={{fontSize: '12px', padding: '1px', margin: '1px', height: '20px', transform: 'translate(20%, 40%)'}}onClick={() => removeSelectedUser(user)}>X</button>
                  </div>
                ))}
              </div>
            </div>
            {/* Scrollable content */}
            <div style={{ maxHeight: '50vh', overflowY: 'auto', padding: '20px', background: '#fff'}}>
              {/* Loading and search results */}
              {loading && <p>Loading...</p>}
              {searchResult && (
                <div>
                  <p>Search Result:</p>
                  <div style={{ display: 'column'}}>
                    {searchResult.map((user) => (
                      <div key={user._id} style={{ padding: '4px', margin: '4px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleUserClick(user)}>
                        <p>{user.firstName} {user.lastName}</p>
                        <p>{user.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Buttons for create and close */}
            <div style={{ padding: '20px', background: '#fff', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px'}}>
              <button onClick={handleSubmit}>Create Group Chat</button>
              <button onClick={closeModal}>Close Modal</button>
            </div>
          </div>
        </div>
      )}
    </div>


  )
}

export default GroupChatModal
