import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Games from "./components/Games";
import VideoCall from "./components/VideoCall";
import Message from "./components/Message";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";
import Tic from "./components/Games/tictactoe";
import Rockpaperscissors from "./components/Games/rockpaperscissors";



import ChatProvider from "./context/chatProvider";

function App() {
  const user = localStorage.getItem("token");

  const { v4: uuid} = require("uuid");


  return (
    <ChatProvider>
      <Routes>
        {user && <Route path="/" element={<Main />} />}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset/*" element={<PasswordReset />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/videocall" element={<Navigate replace to={"/videocall/" + uuid()} />} />
      {user && <Route path="/games" element={<Games />} />}
        {user && <Route path="/videocall/*" element={<VideoCall />} />}
        {user && <Route path="/message" element={<Message />} />}
        {user && <Route path="/games/tictactoe" element={<Tic />} />}
      {user && <Route path="/games/rockpaperscissors" element={<Rockpaperscissors />} />}
    </Routes>
    </ChatProvider>
  );
}

export default App;
