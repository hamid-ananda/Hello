// Import necessary modules and functions
"use client";
import { isLogin, logOut } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "" });
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const loggedIn = await isLogin();

      if (loggedIn.auth) {
        setUser(loggedIn.data);
        setPageReady(true);
      } else {
        router.push("/login");
      }
    };

    authenticate();
  }, []);

  const handleLogOut = () => {
    logOut();
    toast.info("Logged Out");
    router.push("/login");
  };

  const handleGames = () => {
    toast.info("Going to Games page");
    router.push("/games");
  };

  const handleVideoCall = () => {
    toast.info("Going to Video Call page");
    router.push("/video-call");
  };

  const handleMessage = () => {
    toast.info("Going to Message page");
    router.push("/message");
  };

  return (
    <main
      className={`${
        pageReady ? "block" : "hidden"
      } w-full h-screen grid place-items-center bg-gray-800`}
    >
      <div className="p-4 text-white w-[400px] h-[250px] text-center space-y-4">
        <p>
          Welcome {user?.name}! You have entered the home page to the anonymous
          application
        </p>
        <p>{user?.email} is the active email</p>
        <button
          className="uppercase w-[100%] bg-indigo-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-full"
          onClick={handleGames}
        >
          Games
        </button>
        <button
          className="uppercase w-[100%] bg-indigo-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-full"
          onClick={handleVideoCall}
        >
          Video Call
        </button>
        <button
          className="uppercase w-[100%] bg-indigo-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-full"
          onClick={handleMessage}
        >
          Message
        </button>
        <button
          className="uppercase w-[100%] bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-slate-500 rounded-full"
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </main>
  );
}