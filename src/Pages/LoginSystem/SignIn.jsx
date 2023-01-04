import React, { useState} from 'react'
import axios from "../../Contexts/axiosConfig"
import { CurrentTime } from '../../Components/CurrentTime'
import "./credentials.css"
import heart from "../../Assets/credentials/credentials-heart.png"


import { useAuth } from "../../Contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"


function SignIn() {
  
  const { setUser, setFlag, user } = useAuth()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()

 

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
          friendslist: res.data.friendslist,
          gender: res.data.gender,
          region: res.data.region,
          active: true,
        })
        navigate("/homepage")
    } catch (err) {
        setError("Password or Email Incorrect")
    }
  }

  return (
    <>
    <div className="navbar-spacer"></div>
    <div className="credentials-main fcc">
      <div className="credentials-heart-container">
        <img className="credentials-heart" src={heart} />

      </div>
        <div className="credentials-strip" />
        <div className="credentials-content-container">
          <div className = "credentials-image-container">
            <div className="credentials-indv-img a-grid"></div>
            <div className="credentials-indv-img c-grid"></div>
            <div className="credentials-indv-img b-grid"></div>
            <div className="credentials-indv-img d-grid"></div>
            <div className="credentials-indv-img e-grid"></div>
            <div className="credentials-indv-img f-grid"></div>
            <div className="credentials-indv-img g-grid"></div>
          </div>
          <div className = "credentials-form-container">
            <form  onSubmit={handleSubmit} className="credentials-form">
              <h2 className="credentials-title">Sign Into Your Account</h2>
              {error && <div className="credentials-error-container credentials-error">{error}</div>}
              <div className="signin-form">
                <input
                  className="credentials-form-input signin-input"
                  id="Username" 
                  type="text"
                  name="username" 
                  placeholder="Username"
                  value={username}
                  onChange ={(e) => setUsername(e.target.value)} 
                  required>
                </input>

                <input 
                  className="credentials-form-input signin-input"
                  id="Password"
                  name="password"
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange ={(e) => setPassword(e.target.value)} 
                  required>
                </input>
              
                <button className="credentials-form-btn signin-button">Sign In</button>
                <h2 className="grid-k signup-signin-link"> No Account? <Link to="/signup">Click Here</Link></h2>
              </div>
            </form>
          </div>
        </div>
        
        
    </div>
    </>
  )
}

export default SignIn