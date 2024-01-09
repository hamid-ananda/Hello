import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const ForgotPassword = () => {
  const [data, setData] = useState({ email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  // Function to handle input change
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/password-reset";
      const { data: response } = await axios.post(url, data);
      setMessage(response.data);
      setShowNotification(true);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data);
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Reset Your Password</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {message && <div className={styles.success_msg}>{message}</div>}
            {showNotification && (
              <div className={styles.success_msg}>Email sent successfully!</div>
            )}
            <button type="submit" className={styles.purple_btn}>
              Send Reset Link
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Go Back to Login</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
