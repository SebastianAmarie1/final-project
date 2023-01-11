import React, { useState, useRef } from 'react'
import { useAuth } from "../../Contexts/AuthContext"


import "./ProfileCss.css"

import noProfileIcon from "../../Assets/noProfileIcon.png"
import { useEffect } from 'react'

function Profile() {

  const { user } = useAuth()

  const [newProfilePic, setNewProfilePic] = useState(null)
  const [switcherToggle, setSwitcherToggle] = useState(true)

  const fNameRef = useRef()
  const lNameRef = useRef()
  const emailRef= useRef()
  const phoneRef = useRef()
  const regionReg = useRef()

  useEffect(() => {
    if (switcherToggle) {
      fNameRef.current.value = user.fname
      lNameRef.current.value = user.lname
      emailRef.current.value = user.email
      phoneRef.current.value = user.phonenumber
      regionReg.current.value = user.region
    }
  },[user, switcherToggle])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    

  }

  return (
    <div className="profile-main">
      <div className="profile-contianer">
        <div className="profile-change-image-container fcc">
          <div className="profile-image-container fcc">
            <img className="profile-image-current" src={noProfileIcon} />
            {newProfilePic &&
              <img className="profile-image-current" src={noProfileIcon} />
            }
        </div>
          <div className="profile-image-footer fcc">
            <p>name of picture </p>
            <button className="pButton">Change Profile Image <span></span></button>
          </div>

        </div>
        <div className="profile-change-details-container fcc">
            <div className="profile-details-container fcc">
              <div className="profile-switcher" onClick={() => {setSwitcherToggle((value) => !value)}}>
                <div className={`profile-switcher-line ${switcherToggle ? 'profile-switcher-line-top' : 'profile-switcher-line-top-active'}`}></div>
                <div className={`profile-switcher-line ${switcherToggle ? 'profile-switcher-line-bottom' : 'profile-switcher-line-bottom-active'}`}></div>
              </div>
              <h1 className="profile-details-title">{switcherToggle ? 'Details' : 'Profile'}</h1>
              <img className="profile-details-image-current" src={noProfileIcon} />
              <h4>Username</h4>

              {switcherToggle 
                ?
                  <form onSubmit={handleFormSubmit} className="profile-details-form">
                    <input
                      type="text" 
                      ref={fNameRef}
                      className="profile-details-form-input"
                      placeholder="first name"
                    />
                    <input
                      type="text"
                      ref={lNameRef}
                      className="profile-details-form-input"
                      placeholder="last name"
                    />
                    <input 
                      type="text"
                      ref={emailRef}
                      className="profile-details-form-input"
                      placeholder="email"
                    />
                    <input 
                      type="text"
                      ref={phoneRef}
                      className="profile-details-form-input"
                      placeholder="phone number"
                    />
                    <input 
                      type="text"
                      ref={regionReg}
                      className="profile-details-form-input"
                      placeholder="region"
                    />
                    <button className="pButton profile-details-form-button">Submit <span></span></button>
                  </form>
                :
                  <div>
                    <h2>Other </h2>
                    <button className="pButton profile-details-form-button">Submit <span></span></button>
                  </div>
              }
            </div>
        </div>
      </div>
    </div>
  )
}

export default Profile