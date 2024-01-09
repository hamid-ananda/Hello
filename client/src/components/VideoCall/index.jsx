import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Peer from 'peerjs';
import io from 'socket.io-client';

import styles from './styles.module.css';

const Videocall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [dummyState, setDummyState] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);

  const ROOM_ID = window.location.href.split('/').pop();
  const myVideoStream = useRef();
  const videoContainer = useRef();
  const socket = useRef();
  const myPeer = useRef();

  const navigate = useNavigate();

  const colors = ['darkslateblue', 'darkred', 'darkgreen', 'darkgoldenrod', 'slategray', 'navy', 'indigo'];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const handleColorChange = () => {
    setCurrentColorIndex((currentColorIndex + 1) % colors.length);
  };

  const handleToggleMute = () => {
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);
    myVideoStream.current.getAudioTracks()[0].enabled = !newMuteStatus;
  };

  const handleToggleVideo = () => {
    const newVideoStatus = !isVideoEnabled;
    setIsVideoEnabled(newVideoStatus);

    if (myVideoStream.current) {
      const videoTrack = myVideoStream.current.getVideoTracks()[0];

      if (videoTrack) {
        videoTrack.enabled = newVideoStatus;

        const myVideo = document.getElementById(myVideoStream.current.id);

        if (myVideo) {
          myVideo.style.display = newVideoStatus ? 'block' : 'none';
        } else if (newVideoStatus) {
          addVideoStream(myVideoStream.current, myPeer.current.id, true);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Error copying URL to clipboard:', err);
      });
  };

  // anonymity
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


  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.style.width = 640; // Set a specific width or use a percentage
      video.style.height = 480; // Maintain aspect ratio
      video.play();
    });

    video.classList.add(styles.video);
    video.id = stream.id;

    const videoContainer = document.getElementById('video-grid');
    if (videoContainer) {
      const existingVideo = document.getElementById(stream.id);
      if (existingVideo) {
        existingVideo.style.display = 'block';
      } else {
        video.style.width = '45%'; // Set a specific width or use a percentage
        video.style.height = 'auto'; // Maintain aspect ratio

        videoContainer.appendChild(video);
        setDummyState(prevState => !prevState);
      }
    }
  };

  const connectToNewUser = (userId, stream) => {
    const call = myPeer.current.call(userId, stream);
    const video = document.createElement('video');

    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });

    // Handle the 'close' event to remove the video stream when the call is closed
    call.on('close', () => {
      removeVideoStream(video);
    });

    call.on('open', () => {
      call.send(stream);
    });

    // Handle the 'error' event to remove the video stream in case of an error
    call.on('error', () => {
      removeVideoStream(video);
    });
  };

  const removeVideoStream = video => {
    const videoContainer = document.getElementById('video-grid');
    if (videoContainer) {
      const existingVideo = document.getElementById(video.id);
      if (existingVideo) {
        videoContainer.removeChild(existingVideo);
        setDummyState(prevState => !prevState);
      }
    }
  };

  useEffect(() => {
    socket.current = io('http://localhost:8080');

    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id);

      const videoContainerElement = document.createElement('div');
      videoContainerElement.id = 'video-grid';
      videoContainer.current = videoContainerElement;
      document.body.appendChild(videoContainerElement);

      myPeer.current = new Peer(undefined, {
        host: '/',
        port: '3001',
      });

      myPeer.current.on('open', id => {
        console.log('My ID:', id);

        socket.current.emit('join-room', ROOM_ID, id);

        if (!localStorage.getItem('refreshed')) {
          localStorage.setItem('refreshed', 'true');
          window.location.reload();
        }

        socket.current.on('user-connected', userId => {
          console.log('My ID:', myPeer.current.id);
          console.log('Peer ID:', userId);
          connectToNewUser(userId, myVideoStream.current);
        });

        socket.current.on('user-disconnected', userId => {
          const video = document.getElementById(userId);
          if (video) {
            removeVideoStream(video);
          }
        });
      });
    });

    const myVideo = document.createElement('video');
    myVideo.muted = true;

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      myVideoStream.current = stream;
      addVideoStream(myVideo, stream);

      socket.current.emit('join-room', ROOM_ID, myPeer.current.id);

      myPeer.current.on('call', call => {
        call.answer(stream);

        const video = document.createElement('video');

        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream);
        });

        // Handle the 'close' event to remove the video stream when the call is closed
        call.on('close', () => {
          removeVideoStream(video);
        });

        call.on('error', () => {
          removeVideoStream(video);
        });
      });
    });

    // Listen for the 'beforeunload' event
    window.addEventListener('beforeunload', () => {
      // Close the Peer.js connection and emit a signal to inform other peers about disconnection
      if (myPeer.current) {
        myPeer.current.destroy();
      }
      socket.current.emit('user-disconnected', myPeer.current.id);
    });

    // Handle user disconnection when receiving the 'user-disconnected' signal
    socket.current.on('user-disconnected', userId => {
      const video = document.getElementById(userId);
      if (video) {
        removeVideoStream(video);
      }
    });

    return () => {
      if (myPeer.current) {
        myPeer.current.destroy();
      }
      if (socket.current) {
        socket.current.disconnect();
      }

      // Remove the 'beforeunload' event listener
      window.removeEventListener('beforeunload', () => {
        if (myPeer.current) {
          myPeer.current.destroy();
        }
        socket.current.emit('user-disconnected', myPeer.current.id);
      });

      document.body.removeChild(videoContainer.current);
    };
  }, []);

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

      <div className={styles.videoCallContainer}>
        <div className={styles.videoButtonsContainer}>
          <button className={styles.white_btn} onClick={handleToggleVideo}>
            {isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
          </button>

          <button className={styles.white_btn} onClick={handleToggleMute}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>

          <button className={styles.white_btn} onClick={handleCopyUrl}>
            Copy URL
          </button>
        </div>

        <div id="video-grid" className={styles.videoGrid}></div>
      </div>
    </div>
  );
};

export default Videocall;
