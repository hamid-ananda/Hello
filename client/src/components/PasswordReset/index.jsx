import React, { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordReset = async () => {
    try {
      const code = window.location.pathname.replace("/password-reset/", "");
      const url = `http://localhost:8080/api/password-reset/${code}`;
      const { data } = await axios.post(url, { password: newPassword });
      setMessage(data);
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
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Go Back to Login</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form
            className={styles.form_container}
            onSubmit={handlePasswordReset}
          >
            <h1>Reset Your Password</h1>
            <input
              type="text"
              placeholder="New Password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {message && <div className={styles.success_msg}>{message}</div>}
            <button type="submit" className={styles.purple_btn}>
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
