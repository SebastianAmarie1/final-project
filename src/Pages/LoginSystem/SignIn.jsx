import React, { useState, useEffect, useRef} from 'react'
import axios from "../../Contexts/axiosConfig"
import { CurrentTime } from '../../Components/CurrentTime'
import "./signin.css"

import { useAuth } from "../../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"


function SignIn() {
  
  const { setUser, setFlag, user } = useAuth()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const socket = useRef()

  useEffect(() => {
    socket.current = io("ws://localhost:8900")
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const res = await axios.post("/api/login", {username, password, last_login: CurrentTime})
        //CREATE CONTEXT AND SET USER INSIDE THE CONTEXT
        setFlag(true)
        setUser({
          id: res.data.users_id,
          username: res.data.username,
          email: res.data.email,
          phonenumber: res.data.phonenumber,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          followerlist: res.data.followerlist,
          followinglist: res.data.followinglist,
          gender: res.data.gender,
          region: res.data.region,
          active: true,
        })

        socket.current.emit("addUser", {  
          userId : res.data.users_id,
          name : res.data.username,
        })

        navigate("/homepage")
    } catch (err) {
        setError("Password or Email Incorrect")
    }
  }

  return (
    <div className="signin-main">
      <div className="signin-img-container" />
      <div className="signin-form-container">
        <form  onSubmit={handleSubmit} className="signin-form">
          <h2 className="signin-form-title">Sign Into Your Account</h2>
          {error && <div className="signup-error-container signin-error">{error}</div>}
          <input
            className="signin-form-input"
            id="Username" 
            type="text"
            name="username" 
            placeholder="Username"
            value={username}
            onChange ={(e) => setUsername(e.target.value)} 
            required>
          </input>

          <input 
            className="signin-form-input"
            id="Password"
            name="password"
            type="password" 
            placeholder="Password"
            value={password}
            onChange ={(e) => setPassword(e.target.value)} 
            required>
          </input>
          <button className="signin-form-btn">Sign In</button>
        </form>
        <div className="signin-signup-container">
          <h1 className="signin-signup-title">No Account? </h1>
          <h2 className="signin-signup-text">Sign up now and join in on the fun for free. Click the button.</h2>
          <button onClick={() => {navigate("/signup")}} className="signin-form-btn signin-signup-btn">Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default SignIn