import React, { useState } from 'react'
import axios from "../../Contexts/axiosConfig"
import { CurrentTime } from '../../Components/CurrentTime'
import { Link } from "react-router-dom"
import heart from "../../Assets/credentials/credentials-heart.png"
import { validateDetailsData } from "../../Components/Validators"

import "./credentials.css"

function SignUp() {

  /* UseStates for the form*/
  const [username, setUsername] = useState("")
  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("")
  const [email, setEmail] = useState("")
  const [pwd, setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")
  const [phonenumber, setPhonenumber] = useState("")
  const [gender, setGender] = useState("Male")
  const [region, setRegion] = useState("")

  const [errors, setErrors] = useState(null)


  /* Function to check if username and email is not in use already*/
  const isValidUsernameEmail = async() => {
    try {
      const res = await axios.post("/api/checkue", { username, email})
      return res.data
    } catch (err) {
        setErrors([err.message])
    }
  }


  /*Function Used to submit the form once it is filled out*/
  const onSubmitForm = async(e) => {
    e.preventDefault()

    const validatedData = validateDetailsData(username, fName, lName, email, pwd, cPassword, phonenumber, gender, region)

    if (validatedData.length !== 0){
      setErrors(validatedData)
      return
    }

    const check = await isValidUsernameEmail()
    if(!check.check){
      setErrors([check.message])
      return
    }

    try {
        await axios.post("/api/register", { username, fName, lName, email, pwd, phonenumber, region, gender, time_created: CurrentTime})
        window.location = "/signin"//after something is added, the window is refreshed
    } catch (err) {
        setErrors([err.message])
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
          <div className = "credentials-form-container ">
            <form className="credentials-form credentials-form-signup" onSubmit={onSubmitForm}>
              <h2 className="credentials-title">Sign Up</h2>
              {errors && <div className="credentials-error-container credentials-error">{errors[0]}</div>}
              <div className="sign-up-form-container ">

                <div className={`signin-input grid-a wave-group ${username ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="Username" name="username" required value={username} type="text" className="input credentials-form-input" onChange={(e) => {setUsername(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="Username">
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

                <div className={`signin-input grid-b wave-group ${fName ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="FName" name="fname" required value={fName} type="text" className="input credentials-form-input" onChange={(e) => {setFName(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="FName">
                    <span className="label-char" style={{'--index': 0}}>F</span>
                    <span className="label-char" style={{'--index': 1}}>i</span>
                    <span className="label-char" style={{'--index': 2}}>r</span>
                    <span className="label-char" style={{'--index': 3}}>s</span>
                    <span className="label-char" style={{'--index': 4}}>t</span>
                    <span className="label-char" style={{'--index': 4}}> &nbsp;</span>
                    <span className="label-char" style={{'--index': 5}}>N</span>
                    <span className="label-char" style={{'--index': 6}}>a</span>
                    <span className="label-char" style={{'--index': 7}}>m</span>
                    <span className="label-char" style={{'--index': 8}}>e</span>
                  </label>
                </div>

                <div className={`signin-input grid-c wave-group ${lName ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="lName" name="lname" required value={lName} type="text" className="input credentials-form-input" onChange={(e) => {setLName(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="lName">
                    <span className="label-char" style={{'--index': 0}}>L</span>
                    <span className="label-char" style={{'--index': 1}}>a</span>
                    <span className="label-char" style={{'--index': 2}}>s</span>
                    <span className="label-char" style={{'--index': 3}}>t</span>
                    <span className="label-char" style={{'--index': 3}}> &nbsp;</span>
                    <span className="label-char" style={{'--index': 4}}>N</span>
                    <span className="label-char" style={{'--index': 5}}>a</span>
                    <span className="label-char" style={{'--index': 6}}>m</span>
                    <span className="label-char" style={{'--index': 7}}>e</span>
                  </label>
                </div>

                <div className={`signin-input grid-d wave-group ${email ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="Email" name="email" required value={email} type="text" className="input credentials-form-input" onChange={(e) => {setEmail(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="Email">
                    <span className="label-char" style={{'--index': 0}}>E</span>
                    <span className="label-char" style={{'--index': 1}}>m</span>
                    <span className="label-char" style={{'--index': 2}}>a</span>
                    <span className="label-char" style={{'--index': 3}}>i</span>
                    <span className="label-char" style={{'--index': 4}}>l</span>
                  </label>
                </div>

                <div className={`signin-input grid-e wave-group ${pwd ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="Pwd" name="pwd" required value={pwd} type="password" className="input credentials-form-input" onChange={(e) => {setPassword(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="Pwd">
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

                <div className={`signin-input grid-f wave-group ${cPassword ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="CPassword" name="cpassword" required value={cPassword} type="password" className="input credentials-form-input" onChange={(e) => {setCPassword(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="CPassword">
                    <span className="label-char" style={{'--index': 0}}>C</span>
                    <span className="label-char" style={{'--index': 1}}>o</span>
                    <span className="label-char" style={{'--index': 2}}>n</span>
                    <span className="label-char" style={{'--index': 3}}>f</span>
                    <span className="label-char" style={{'--index': 4}}>i</span>
                    <span className="label-char" style={{'--index': 5}}>r</span>
                    <span className="label-char" style={{'--index': 6}}>m</span>
                    <span className="label-char" style={{'--index': 6}}>&nbsp;</span>
                    <span className="label-char" style={{'--index': 7}}>p</span>
                    <span className="label-char" style={{'--index': 8}}>a</span>
                    <span className="label-char" style={{'--index': 9}}>s</span>
                    <span className="label-char" style={{'--index': 10}}>s</span>
                    <span className="label-char" style={{'--index': 11}}>w</span>
                    <span className="label-char" style={{'--index': 12}}>o</span>
                    <span className="label-char" style={{'--index': 13}}>r</span>
                    <span className="label-char" style={{'--index': 14}}>d</span>
                  </label>
                </div>

                <div className={`signin-input grid-g wave-group ${region ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="Region" name="region" required value={region} type="text" className="input credentials-form-input" onChange={(e) => {setRegion(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="Region">
                    <span className="label-char" style={{'--index': 0}}>R</span>
                    <span className="label-char" style={{'--index': 1}}>e</span>
                    <span className="label-char" style={{'--index': 2}}>g</span>
                    <span className="label-char" style={{'--index': 3}}>i</span>
                    <span className="label-char" style={{'--index': 4}}>o</span>
                    <span className="label-char" style={{'--index': 5}}>n</span>
                  </label>
                </div>
                
                <div className={`signin-input grid-h wave-group ${phonenumber ?'wave-group-active' : 'wave-group-deactive'} big-input`} >
                  <input id="Phonenumber" name="phonenumber" required value={phonenumber} type="text" className="input credentials-form-input" onChange={(e) => {setPhonenumber(e.target.value)}}/>
                  <span className="bar big-input"></span>
                  <label className="label" htmlFor="Phonenumber">
                    <span className="label-char" style={{'--index': 0}}>P</span>
                    <span className="label-char" style={{'--index': 1}}>h</span>
                    <span className="label-char" style={{'--index': 2}}>o</span>
                    <span className="label-char" style={{'--index': 3}}>n</span>
                    <span className="label-char" style={{'--index': 4}}>e</span>
                    <span className="label-char" style={{'--index': 4}}>&nbsp;</span>
                    <span className="label-char" style={{'--index': 5}}>N</span>
                    <span className="label-char" style={{'--index': 6}}>u</span>
                    <span className="label-char" style={{'--index': 7}}>m</span>
                    <span className="label-char" style={{'--index': 8}}>b</span>
                    <span className="label-char" style={{'--index': 9}}>e</span>
                    <span className="label-char" style={{'--index': 10}}>r</span>
                  </label>
                </div>

                <select onChange={(e) => {setGender(e.target.value)}} className="grid-i credentials-form-input" id="gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <button className="grid-j credentials-form-btn" type="submit">Sign Up</button>
                <h2 className="grid-k signup-signin-link"> No Account? <Link className='link' to="/signin">Click Here</Link></h2>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default SignUp