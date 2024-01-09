import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { ChatState } from "../../context/chatProvider";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const {setUser} = ChatState();
	
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
			// Post request and sets a token used to identify user is logged in
			const { data: res } = await axios.post(url, data);
			setUser(res.data);
			localStorage.setItem("token", res.data);

			

			const config = {
				headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			};

			console.log(config);
			const friendUrl = "http://localhost:8080/api/friends/init";
			await axios.get(friendUrl, config);

			// const requestUrl = "http://localhost:8080/api/requests/init"
			// await axios.get(requestUrl, config);
			
			
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.purple_btn}>
							Sign In
						</button>
					</form>
					<form className={styles.form_container}>
					<h3>Forgot Password?</h3>
					<Link to="/forgotpassword">
						<button type="submit" className={styles.purple_btn}>
							Change Password
						</button>
					</Link>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
