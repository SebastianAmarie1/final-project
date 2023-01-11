import React, { useState, useRef } from 'react'
import { useAuth } from "../../Contexts/AuthContext"


import "./ProfileCss.css"

import noProfileIcon from "../../Assets/default-user-image.jpg"
import { useEffect } from 'react'

function Profile() {

  const { user, axiosAuth, setUser, setFlag } = useAuth()

  const [newProfilePic, setNewProfilePic] = useState(null)
  const [switcherToggle, setSwitcherToggle] = useState(true)
  const [dataURI, setDataURI] = useState(null)

  const fNameRef = useRef()
  const lNameRef = useRef()
  const emailRef= useRef()
  const phoneRef = useRef()
  const regionReg = useRef()

  const bioRef = useRef()
  const hobbie1Ref= useRef()
  const hobbie2Ref= useRef()
  const hobbie3Ref= useRef()
  const fact1Ref = useRef()
  const fact2Ref = useRef()
  const lieRef = useRef()

  useEffect(() => {
    if (switcherToggle) {
      fNameRef.current.value = user.fname
      lNameRef.current.value = user.lname
      emailRef.current.value = user.email
      phoneRef.current.value = user.phonenumber
      regionReg.current.value = user.region
    } else {
      bioRef.current.value = user.bio
      hobbie1Ref.current.value = user.hobbie1
      hobbie2Ref.current.value = user.hobbie2
      hobbie3Ref.current.value = user.hobbie3
      fact1Ref.current.value = user.fact1
      fact2Ref.current.value = user.fact2
      lieRef.current.value = user.lie
    }
  },[user, switcherToggle])

  const handleImageChange = (e) => {
    setNewProfilePic(e.target.files[0])
  }

  const handleUploadImage = async(e) => {
    e.preventDefault()
    if(!newProfilePic){
      return console.log("Please select a file")
    }

    const formData = new FormData()
    formData.append("id", user.id)
    formData.append("file", newProfilePic)


    const res = await axiosAuth.put("/api/profile_pic",formData,
    { headers: 
        { 
          'Content-Type': 'multipart/form-data',
          'authorization': "Bearer " + user.accessToken
        }
    })
    setFlag(true)
    setUser({
      ...user,
      profile_pic: res.data.profile_pic,
    })
    setNewProfilePic(null)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    try { 
      const res = await axiosAuth.put("/api/edit_details", { 
        id: user.id,
        fname: fNameRef.current.value,
        lname: lNameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        region: regionReg.current.value,
      },
      { headers: 
          { authorization: "Bearer " + user.accessToken}
      })
      setFlag(true)
      setUser({
        ...user,
        fname: res.data.user.fname,
        lname: res.data.user.lname,
        email: res.data.user.email,
        phone: res.data.user.phone,
        region: res.data.user.region,
      })
    } catch (error) {
        console.log(error)
    }
  }

  const handleFormSubmitProfile = async (e) => {
    e.preventDefault()
    
    try { 
      const res = await axiosAuth.put("/api/edit_profile", { 
        id: user.id,
        bio: bioRef.current.value,
        hobbie1: hobbie1Ref.current.value,
        hobbie2: hobbie2Ref.current.value,
        hobbie3: hobbie3Ref.current.value,
        fact1: fact1Ref.current.value,
        fact2: fact2Ref.current.value,
        lie: lieRef.current.value,
      },
      { headers: 
          { authorization: "Bearer " + user.accessToken}
      })
      setFlag(true)
      setUser({
        ...user,
        bio: res.data.user.bio,
        hobbie1: res.data.user.hobbie1,
        hobbie2: res.data.user.hobbie2,
        hobbie3: res.data.user.hobbie3,
        fact1: res.data.user.fact1,
        fact2: res.data.user.fact2,
        lie: res.data.user.lie,
      })
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="profile-main">
      <div className="profile-contianer">
        <div className="profile-change-image-container fcc">
          <div className="profile-image-container fcc">
            <img className="profile-image-current" src={user.profile_pic ? user.profile_pic : noProfileIcon} />
            {newProfilePic &&
              <img className="profile-image-current" src={URL.createObjectURL(newProfilePic)} />
            }
        </div>
          <div className="profile-image-footer fcc">
            <input type="file" onChange={handleImageChange} />
            <button className="pButton" onClick={handleUploadImage}>Change Profile Image <span></span></button>
          </div>

        </div>
        <div className="profile-change-details-container fcc">
            <div className="profile-details-container fcc">
              <div className="profile-switcher" onClick={() => {setSwitcherToggle((value) => !value)}}>
                <div className={`profile-switcher-line ${switcherToggle ? 'profile-switcher-line-top' : 'profile-switcher-line-top-active'}`}></div>
                <div className={`profile-switcher-line ${switcherToggle ? 'profile-switcher-line-bottom' : 'profile-switcher-line-bottom-active'}`}></div>
              </div>
              <h1 className="profile-details-title">{switcherToggle ? 'Details' : 'Profile'}</h1>
              <img className="profile-details-image-current" src={user.profile_pic ? user.profile_pic : noProfileIcon} />
              <h4>{user.username}</h4>

              {switcherToggle 
                ?
                  <form onSubmit={handleFormSubmit} className="profile-details-form">
                    <input
                      type="text" 
                      ref={fNameRef}
                      className="profile-details-form-input"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      ref={lNameRef}
                      className="profile-details-form-input"
                      placeholder="Last Name"
                    />
                    <input 
                      type="text"
                      ref={emailRef}
                      className="profile-details-form-input"
                      placeholder="Email"
                    />
                    <input 
                      type="text"
                      ref={phoneRef}
                      className="profile-details-form-input"
                      placeholder="Phone Number"
                    />
                    <input 
                      type="text"
                      ref={regionReg}
                      className="profile-details-form-input"
                      placeholder="Region"
                    />
                    <button className="pButton profile-details-form-button">Submit <span></span></button>
                  </form>
                :
                  <form onSubmit={handleFormSubmitProfile} className="profile-details-form">
                    <input
                      type="text" 
                      ref={bioRef}
                      className="profile-details-form-input"
                      placeholder="Bio"
                    />
                    <input
                      type="text"
                      ref={hobbie1Ref}
                      className="profile-details-form-input"
                      placeholder="Hobbie 1"
                    />
                    <input 
                      type="text"
                      ref={hobbie2Ref}
                      className="profile-details-form-input"
                      placeholder="Hobbie 2"
                    />
                    <input 
                      type="text"
                      ref={hobbie3Ref}
                      className="profile-details-form-input"
                      placeholder="Hobbie 3"
                    />
                    <input 
                      type="text"
                      ref={fact1Ref}
                      className="profile-details-form-input"
                      placeholder="Fact 1"
                    />
                    <input 
                      type="text"
                      ref={fact2Ref}
                      className="profile-details-form-input"
                      placeholder="Fact 2"
                    />
                    <input 
                      type="text"
                      ref={lieRef}
                      className="profile-details-form-input"
                      placeholder="Lie"
                    />
                    <button className="pButton profile-details-form-button">Submit <span></span></button>
                  </form>
              }
            </div>
        </div>
      </div>
    </div>
  )
}

export default Profile