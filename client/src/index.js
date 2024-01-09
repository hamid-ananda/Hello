import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import ChatProvider from "./context/chatProvider";

// need to fix the issue with chatprovider + login page not rendering

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ChatProvider>
				<App />
			</ChatProvider>
		</BrowserRouter>
	</React.StrictMode>,

	document.getElementById("root")
);
