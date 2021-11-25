import React, { useState } from "react";
import axios from "axios";

import styles from "./Landing.module.css";

import image from "../assets/interview.svg";

function Landing(props) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState("");

  const [isRegisteredLogin, setIsRegisteredLogin] = useState(false);
  const [tokenLogin, setTokenLogin] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    axios({
      method: "post",
      url: "http://localhost:8000/signup",
      data: {
        name: name,
        email: email,
        password: password,
        phone: phone,
      },
    })
      .then((result) => {
        setIsRegistered(true);
        setToken(result.data.token);
        localStorage.setItem("token", result.data.token);
        props.onChange(isRegistered, token);
      })
      .catch((error) => {
        error = new Error();
      });
  };
  const handleSubmitLogin = (event) => {
    event.preventDefault();

    axios({
      method: "post",
      url: "http://localhost:8000/login",
      data: {
        email: emailLogin,
        password: passwordLogin,
      },
    })
      .then((result) => {
        setIsRegisteredLogin(true);
        setTokenLogin(result.data.token);
        localStorage.setItem("token", result.data.token);
        props.onChange(isRegisteredLogin, tokenLogin);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <div className="section">
      <div className={styles.right}>
        <h1 className={styles.header}>Your Personal Interview Portal</h1>
        <h3 className={styles.smallheader}>
          Schedule interviews with interviewees and view all your upcoming
          interviews in one place.
        </h3>
        <img src={image} alt="placeholders" className={styles.image} />
      </div>
      <div className={styles.forms}>
        SIGN UP
        <form className={styles.formSignUp} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            required
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="number"
            placeholder="Phone Number"
            required
            name="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <input className={styles.submit} type="submit" value="SIGN UP" />
        </form>
        <div className={styles.partition}>
          <div className={styles.line}></div>
          OR LOGIN
          <div className={styles.line}></div>
        </div>
        <form className={styles.formSignUp} onSubmit={handleSubmitLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            value={emailLogin}
            onChange={(event) => setEmailLogin(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            name="password"
            value={passwordLogin}
            onChange={(event) => setPasswordLogin(event.target.value)}
          />
          <input className={styles.submit} type="submit" value="LOGIN" />
        </form>
      </div>
    </div>
  );
}

export default Landing;
