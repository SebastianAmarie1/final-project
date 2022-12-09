import React, { useState } from 'react'
import axios from "../../Contexts/axiosConfig"
import { CurrentTime } from '../../Components/CurrentTime'
import { useNavigate } from "react-router-dom"
import "./signup.css"
import SignUpImage from "../../Assets/signup-placeholder.jpg"

function SignUp() {

  const [username, setUsername] = useState("")
  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("")
  const [email, setEmail] = useState("")
  const [pwd, setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")
  const [phonenumber, setPhonenumber] = useState("")
  const [gender, setGender] = useState("Male")
  const [region, setRegion] = useState("")

  const [error, setError] = useState(null)
  const navigate = useNavigate()


  function isValidEmail() {
    return /\S+@\S+\.\S+/.test(email);
  }

  const isValidUsernameEmail = async() => {
    try {
      const res = await axios.post("/api/checkue", { username, email})
      return res.data
    } catch (err) {
        console.error(err.message)
    }
  }

  const onSubmitForm = async(e) => {
    e.preventDefault()
    
    if (pwd !== cPassword) {
      setError("Passwords Dont Match!")
      return
    }
    if(!isValidEmail()){
      setError("Email Is Not Valid")
      return
    }
    const check = await isValidUsernameEmail()
    if(!check.check){
      setError(check.message)
      return
    }


    try {
        const res = await axios.post("/api/register", { username, fName, lName, email, pwd, phonenumber, region, gender, time_created: CurrentTime})
        window.location = "/signin"//after something is added, the window is refreshed
    } catch (err) {
        console.error(err.message)
    }
  }

  return (
    <>
    <div className="signup-main">
      <div className="signup-img-container" />
      <div className="signup-form-container">
        <form className="signup-form" onSubmit={onSubmitForm}>
          <h2 className="signup-title">Sign Up</h2>
          {error && <div className="signup-error-container">{error}</div>}
          <div className="sign-up-form-container">
            <input
              className = "grid-a signup-form-input" 
              type="text"
              id="username" 
              value={username}
              onChange={e => setUsername(e.target.value)} 
              placeholder="Username" 
              required/>

            <input
              className = "grid-b signup-form-input"  
              type="text"
              id="fName" 
              value={fName}
              onChange={e => setFName(e.target.value)} 
              placeholder="First Name" 
              required/>

            <input
              className = "grid-c signup-form-input"  
              type="text"
              id="lName" 
              value={lName}
              onChange={e => setLName(e.target.value)} 
              placeholder="Last Name" 
              required/>

            <input
              className = "grid-d signup-form-input"  
              type="text"
              id="email" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email" 
              required/>
            
            <input
              className = "grid-e signup-form-input"  
              type="text"
              id="password" 
              value={pwd}
              onChange={e => setPassword(e.target.value)} 
              placeholder="Password"
              required/>

            <input
              className = "grid-f signup-form-input"  
              type="text"
              id="cPassword" 
              value={cPassword}
              onChange={e => setCPassword(e.target.value)} 
              placeholder="Confirm Password" 
              required/>
            
            <input
              className = "grid-g signup-form-input"  
              type="text"
              id="region" 
              value={region}
              onChange={e => setRegion(e.target.value)} 
              placeholder="Region" 
              required/>

            <input
              className = "grid-h signup-form-input"  
              type="text"
              id="phonenumber" 
              value={phonenumber}
              onChange={e => setPhonenumber(e.target.value)} 
              placeholder="Phone Number" 
              required/>

            <select onChange={(e) => {setGender(e.target.value)}} className="grid-i signup-form-input" id="gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button className="grid-j signup-form-btn" type="submit">Sign Up</button>
          </div>
        </form>
        <div className="signup-signin-container">
          <h2 className="signup-signin-title">Already got an account?</h2>
          <h5 className="signup-signin-text">Log in now and hop into a video call.</h5>
          <button className="signup-form-btn signup-signin-btn" onClick={() => {navigate("/signin")}}>Sign In</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default SignUp