import React, { useState } from 'react'
import axios from "../../Contexts/axiosConfig"
import { CurrentTime } from '../../Components/CurrentTime'
import { useNavigate, Link } from "react-router-dom"
import heart from "../../Assets/credentials/credentials-heart.png"

import "./credentials.css"

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
            <form className="credentials-form" onSubmit={onSubmitForm}>
              <h2 className="credentials-title">Sign Up</h2>
              {error && <div className="signup-error-container">{error}</div>}
              <div className="sign-up-form-container">
                <input
                  className = "grid-a credentials-form-input" 
                  type="text"
                  id="username" 
                  value={username}
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Username" 
                  required/>

                <input
                  className = "grid-b credentials-form-input"  
                  type="text"
                  id="fName" 
                  value={fName}
                  onChange={e => setFName(e.target.value)} 
                  placeholder="First Name" 
                  required/>

                <input
                  className = "grid-c credentials-form-input"  
                  type="text"
                  id="lName" 
                  value={lName}
                  onChange={e => setLName(e.target.value)} 
                  placeholder="Last Name" 
                  required/>

                <input
                  className = "grid-d credentials-form-input"  
                  type="text"
                  id="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Email" 
                  required/>
                
                <input
                  className = "grid-e credentials-form-input"  
                  type="text"
                  id="password" 
                  value={pwd}
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Password"
                  required/>

                <input
                  className = "grid-f credentials-form-input"  
                  type="text"
                  id="cPassword" 
                  value={cPassword}
                  onChange={e => setCPassword(e.target.value)} 
                  placeholder="Confirm Password" 
                  required/>
                
                <input
                  className = "grid-g credentials-form-input"  
                  type="text"
                  id="region" 
                  value={region}
                  onChange={e => setRegion(e.target.value)} 
                  placeholder="Region" 
                  required/>

                <input
                  className = "grid-h credentials-form-input"  
                  type="text"
                  id="phonenumber" 
                  value={phonenumber}
                  onChange={e => setPhonenumber(e.target.value)} 
                  placeholder="Phone Number" 
                  required/>

                <select onChange={(e) => {setGender(e.target.value)}} className="grid-i credentials-form-input" id="gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <button className="grid-j credentials-form-btn" type="submit">Sign Up</button>
                <h2 className="grid-k signup-signin-link"> No Account? <Link to="/signin">Click Here</Link></h2>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default SignUp