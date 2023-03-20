import React, { useState} from 'react'
import axios from "../../Contexts/axiosConfig"
import { CurrentTime } from '../../Components/CurrentTime'
import "./credentials.css"
import heart from "../../Assets/credentials/credentials-heart.png"
import { validateLoginInputs } from "../../Components/Validators"

import { useAuth } from "../../Contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"


function SignIn() {
  
  /*Variables from context*/
  const { setUser, setFlag, user } = useAuth()
  const navigate = useNavigate()

  /*Use States for the login form*/
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);


  /*Function that submits the form*/
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validatedData = validateLoginInputs(username, password)

    if (validatedData.length !== 0){
      setErrors(validatedData)
      return
    }

    try {
      const res = await axios.post("/api/login", { 
        username, 
        password, 
        last_login: CurrentTime 
      }, 
      { 
        withCredentials: true 
      })

      if (res.data.status === "Login Successful"){
        setFlag(true)
        setUser({
          id: res.data.users_id,
          username: res.data.username,
          fname: res.data.fname,
          lname: res.data.lname,
          email: res.data.email,
            phonenumber: res.data.phonenumber,
            profile: {
              profile_pic: res.data.pfp,
              bio: res.data.bio,
              hobbie1: res.data.hobbie1,
              hobbie2: res.data.hobbie2,
              hobbie3: res.data.hobbie3,
              fact1: res.data.fact1,
              fact2: res.data.fact2,
              lie: res.data.lie,
            },
            accessToken: res.data.accessToken,
            friendslist: res.data.friendslist,
            gender: res.data.gender,
            region: res.data.region,
            active: true,
          })
          navigate("/homepage")
      } else {
        setErrors([res.data.status])
      }

    } catch (err) {
        setErrors(["Error Logging In"])
    }
  }


  return (
    <div className="credentials-main fcc">
      <div className="credentials-heart-container">
        <img loading="lazy" className="credentials-heart" src={heart} />

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
              {errors && <div className="credentials-error-container credentials-error">{errors[0]}</div>}
              <div className="signin-form">
                
                <div className={`signin-input wave-group ${username ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="Username" name="username" required value={username} type="text" className="input credentials-form-input" onChange={(e) => {setUsername(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label">
                    <span className="label-char" style={{'--index': 0}}>U</span>
                    <span className="label-char" style={{'--index': 1}}>s</span>
                    <span className="label-char" style={{'--index': 2}}>e</span>
                    <span className="label-char" style={{'--index': 3}}>r</span>
                    <span className="label-char" style={{'--index': 4}}>n</span>
                    <span className="label-char" style={{'--index': 5}}>a</span>
                    <span className="label-char" style={{'--index': 6}}>m</span>
                    <span className="label-char" style={{'--index': 7}}>e</span>
                  </label>
                </div>

                <div className={`signin-input wave-group ${password ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="Password" name="password" required value={password} type="password" className="input credentials-form-input" onChange={(e) => {setPassword(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label">
                    <span className="label-char" style={{'--index': 0}}>P</span>
                    <span className="label-char" style={{'--index': 1}}>a</span>
                    <span className="label-char" style={{'--index': 2}}>s</span>
                    <span className="label-char" style={{'--index': 3}}>s</span>
                    <span className="label-char" style={{'--index': 4}}>w</span>
                    <span className="label-char" style={{'--index': 5}}>o</span>
                    <span className="label-char" style={{'--index': 6}}>r</span>
                    <span className="label-char" style={{'--index': 7}}>d</span>
                  </label>
                </div>
              
                <button className="credentials-form-btn signin-button">Sign In</button>
                <h2 className="grid-k signup-signin-link"> No Account? <Link className="link"to="/signup">Click Here</Link></h2>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default SignIn