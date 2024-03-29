import React, { useState } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { validateProfileDetailsData, validateProfileData } from "../../Components/Validators"
import axios from "../../Contexts/axiosConfig"

import "./ProfileCss.css"

import noProfileIcon from "../../Assets/default-user-image.jpg"

function Profile() {

  /* Use Context Variables */
  const { user, axiosAuth, setUser, setFlag } = useAuth()

  const [errors, setErrors] = useState(null)
  /*For the Image Section*/
  const [newProfilePic, setNewProfilePic] = useState(null)
  const [switcherToggle, setSwitcherToggle] = useState(true)

  /* For the Details section*/
  const [fName, setFname] = useState(user.fname)
  const [lName, setLname] = useState(user.lname)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phonenumber)
  const [region, setRegion] = useState(user.region)
  
  /*For the Profile section*/
  const [bio, setBio] = useState(user.profile.bio)
  const [hobbie1, setHobbie1] = useState(user.profile.hobbie1)
  const [hobbie2, setHobbie2] = useState(user.profile.hobbie2)
  const [hobbie3, setHobbie3] = useState(user.profile.hobbie3)
  const [fact1, setFact1] = useState(user.profile.fact1)
  const [fact2, setFact2] = useState(user.profile.fact2)
  const [lie, setLie] = useState(user.profile.lie)

  /*Used to set a new image from target files*/
  const handleImageChange = (e) => {
    setNewProfilePic(e.target.files[0])
  }


  /*Handles the upload of an image to the back end*/
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
      profile: {
        ...user.profile,
        profile_pic: res.data.profile_pic,
      }
    })
    setNewProfilePic(null)
  }


  /* Verifies to see if the username and email are available or not*/
  const isValidUsernameEmail = async() => {
    try {
      const res = await axios.post("/api/checkue", { username: null, email})
      return res.data
    } catch (err) {
        setErrors([err.message])
    }
  }


  /*Handles the form submit for details*/
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const validatedData = validateProfileDetailsData(fName, lName, email, phone, region)

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
      const res = await axiosAuth.put("/api/edit_details", { 
        id: user.id,
        fname: fName,
        lname: lName,
        email: email,
        phone: phone,
        region: region,
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
        phonenumber: res.data.user.phonenumber,
        region: res.data.user.region,
      })

    } catch (error) {
        console.log(error)
    }
  }


  /*Submits the Profile information to the back end*/
  const handleFormSubmitProfile = async (e) => {
    e.preventDefault()

    const validatedData = validateProfileData(bio, hobbie1, hobbie2, hobbie3, fact1, fact2, lie)

    if (validatedData.length !== 0){
      setErrors(validatedData)
      return
    }
    
    try { 
      const res = await axiosAuth.put("/api/edit_profile", { 
        id: user.id,
        bio: bio,
        hobbie1: hobbie1,
        hobbie2: hobbie2,
        hobbie3: hobbie3,
        fact1: fact1,
        fact2: fact2,
        lie: lie,
      }, { headers: 
          { authorization: "Bearer " + user.accessToken}
      })

      setFlag(true)
      setUser({
        ...user,
        profile: {
          ...user.profile,
          bio: res.data.user.bio,
          hobbie1: res.data.user.hobbie1,
          hobbie2: res.data.user.hobbie2,
          hobbie3: res.data.user.hobbie3,
          fact1: res.data.user.fact1,
          fact2: res.data.user.fact2,
          lie: res.data.user.lie,
        },
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
            <div className="profile-pfp-container">
              <div className="profile-pfp-box profile-pfp-box1"/>
              <div className="profile-pfp-box profile-pfp-box2"/>
              <div className="profile-pfp-box profile-pfp-box3"/>
              <img className="profile-image-current" src={user.profile?.profile_pic ? user.profile?.profile_pic : noProfileIcon} />
            </div>
            
            {newProfilePic &&
              <img className="profile-image-current" src={URL.createObjectURL(newProfilePic)} />
            }
        </div>
          <div className="profile-image-footer fcc">
            
            <div className="file-input">
              <input type="file" onChange={handleImageChange} id="file" className="file"/>
              <label htmlFor="file">Select file</label>
            </div>

            <button className="pButton" onClick={handleUploadImage}>Change Profile Image <span></span></button>
          </div>

        </div>
        <div className="profile-change-details-container fcc">
            <div className="profile-details-container fcc">
              <div className="profile-switcher" onClick={() => {setSwitcherToggle((value) => !value)}}>
                <div className={`profile-switcher-line ${switcherToggle ? 'profile-switcher-line-top' : 'profile-switcher-line-top-active'}`}></div>
                <div className={`profile-switcher-line ${switcherToggle ? 'profile-switcher-line-bottom' : 'profile-switcher-line-bottom-active'}`}></div>
              </div>
              <h2 className="profile-details-title">{switcherToggle ? 'Details' : 'Profile'}</h2>
              <img className="profile-details-image-current" src={user.profile?.profile_pic ? user.profile?.profile_pic : noProfileIcon} />
              <h2>{user.username}</h2>

              {errors && <div className="credentials-error-container credentials-error">{errors[0]}</div>}

              {switcherToggle 
                ?
                  <form onSubmit={handleFormSubmit} className="profile-details-form">

                    <div className="profile-form-inline">
                      <div className={`wave-group ${fName ?'wave-group-active' : 'wave-group-deactive'} small-input`}>
                        <input required="" value={fName} type="text" className="input small-input" onChange={(e) => {setFname(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>F</span>
                          <span className="label-char" style={{'--index': 1}}>.</span>
                          <span className="label-char" style={{'--index': 2}}>N</span>
                          <span className="label-char" style={{'--index': 3}}>a</span>
                          <span className="label-char" style={{'--index': 4}}>m</span>
                          <span className="label-char" style={{'--index': 5}}>e</span>
                        </label>
                      </div>

                      <div className={`wave-group ${lName ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={lName} type="text" className="input small-input" onChange={(e) => {setLname(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>L</span>
                          <span className="label-char" style={{'--index': 1}}>.</span>
                          <span className="label-char" style={{'--index': 2}}>N</span>
                          <span className="label-char" style={{'--index': 3}}>a</span>
                          <span className="label-char" style={{'--index': 4}}>m</span>
                          <span className="label-char" style={{'--index': 5}}>e</span>
                        </label>
                      </div>
                    </div>

                    <div className={`wave-group ${email ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                      <input required="" value={email} type="text" className="input small-input" onChange={(e) => {setEmail(e.target.value)}}/>
                      <span className="bar small-input"></span>
                      <label className="label">
                        <span className="label-char" style={{'--index': 0}}>E</span>
                        <span className="label-char" style={{'--index': 1}}>m</span>
                        <span className="label-char" style={{'--index': 2}}>a</span>
                        <span className="label-char" style={{'--index': 3}}>i</span>
                        <span className="label-char" style={{'--index': 4}}>l</span>
                      </label>
                    </div>

                    <div className="profile-form-inline">
                      <div className={`wave-group ${phone ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={phone} type="text" className="input small-input" onChange={(e) => {setPhone(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>P</span>
                          <span className="label-char" style={{'--index': 1}}>h</span>
                          <span className="label-char" style={{'--index': 2}}>o</span>
                          <span className="label-char" style={{'--index': 3}}>n</span>
                          <span className="label-char" style={{'--index': 4}}>e</span>
                        </label>
                      </div>

                      <div className={`wave-group ${region ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={region} type="text" className="input small-input" onChange={(e) => {setRegion(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>R</span>
                          <span className="label-char" style={{'--index': 1}}>e</span>
                          <span className="label-char" style={{'--index': 2}}>g</span>
                          <span className="label-char" style={{'--index': 3}}>i</span>
                          <span className="label-char" style={{'--index': 4}}>o</span>
                          <span className="label-char" style={{'--index': 5}}>n</span>
                        </label>
                      </div>
                    </div>
                    <button className="pButton profile-details-form-button">Submit <span></span></button>
                  </form>
                :
                  <form onSubmit={handleFormSubmitProfile} className="profile-details-form">
                    
                    <div className={`wave-group ${bio ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                      <input required="" value={bio} type="text" className="input small-input" onChange={(e) => {setBio(e.target.value)}}/>
                      <span className="bar small-input"></span>
                      <label className="label">
                        <span className="label-char" style={{'--index': 0}}>B</span>
                        <span className="label-char" style={{'--index': 1}}>i</span>
                        <span className="label-char" style={{'--index': 2}}>o</span>
                      </label>
                    </div>

                    <div className="profile-form-inline">
                      <div className="small-input">
                        <h2 className="profile-form-title">Hobbies:</h2>
                      </div>
                      <div className={`wave-group ${hobbie1 ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={hobbie1} type="text" className="input small-input" onChange={(e) => {setHobbie1(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>H</span>
                          <span className="label-char" style={{'--index': 1}}>o</span>
                          <span className="label-char" style={{'--index': 2}}>b</span>
                          <span className="label-char" style={{'--index': 3}}>b</span>
                          <span className="label-char" style={{'--index': 4}}>i</span>
                          <span className="label-char" style={{'--index': 5}}>e</span>
                          <span className="label-char" style={{'--index': 6}}>-</span>
                          <span className="label-char" style={{'--index': 5}}>1</span>
                        </label>
                      </div>
                    </div>

                    <div className="profile-form-inline">
                      <div className={`wave-group ${hobbie2 ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={hobbie2} type="text" className="input small-input" onChange={(e) => {setHobbie2(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>H</span>
                          <span className="label-char" style={{'--index': 1}}>o</span>
                          <span className="label-char" style={{'--index': 2}}>b</span>
                          <span className="label-char" style={{'--index': 3}}>b</span>
                          <span className="label-char" style={{'--index': 4}}>i</span>
                          <span className="label-char" style={{'--index': 5}}>e</span>
                          <span className="label-char" style={{'--index': 6}}>-</span>
                          <span className="label-char" style={{'--index': 5}}>2</span>
                        </label>
                      </div>

                      <div className={`wave-group ${hobbie3 ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={hobbie3} type="text" className="input small-input" onChange={(e) => {setHobbie3(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>H</span>
                          <span className="label-char" style={{'--index': 1}}>o</span>
                          <span className="label-char" style={{'--index': 2}}>b</span>
                          <span className="label-char" style={{'--index': 3}}>b</span>
                          <span className="label-char" style={{'--index': 4}}>i</span>
                          <span className="label-char" style={{'--index': 5}}>e</span>
                          <span className="label-char" style={{'--index': 6}}>-</span>
                          <span className="label-char" style={{'--index': 5}}>3</span>
                        </label>
                      </div>
                    </div>

                    <div className="profile-form-inline">
                      <div className="small-input">
                        <h2 className="profile-form-title">2 Truths 1 Lie:</h2>
                      </div>

                    <div className={`wave-group ${fact1 ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                      <input required="" value={fact1} type="text" className="input small-input" onChange={(e) => {setFact1(e.target.value)}}/>
                      <span className="bar small-input"></span>
                      <label className="label">
                        <span className="label-char" style={{'--index': 0}}>F</span>
                        <span className="label-char" style={{'--index': 1}}>a</span>
                        <span className="label-char" style={{'--index': 2}}>c</span>
                        <span className="label-char" style={{'--index': 3}}>t</span>
                        <span className="label-char" style={{'--index': 4}}>-</span>
                        <span className="label-char" style={{'--index': 5}}>1</span>
                      </label>
                    </div>
                    </div>

                    <div className="profile-form-inline">
                      <div className={`wave-group ${fact2 ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={fact2} type="text" className="input small-input" onChange={(e) => {setFact2(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>F</span>
                          <span className="label-char" style={{'--index': 1}}>a</span>
                          <span className="label-char" style={{'--index': 2}}>c</span>
                          <span className="label-char" style={{'--index': 3}}>t</span>
                          <span className="label-char" style={{'--index': 4}}>-</span>
                          <span className="label-char" style={{'--index': 5}}>2</span>
                        </label>
                      </div>

                      <div className={`wave-group ${lie ?'wave-group-active' : 'wave-group-deactive'} small-input`} >
                        <input required="" value={lie} type="text" className="input small-input" onChange={(e) => {setLie(e.target.value)}}/>
                        <span className="bar small-input"></span>
                        <label className="label">
                          <span className="label-char" style={{'--index': 0}}>L</span>
                          <span className="label-char" style={{'--index': 1}}>i</span>
                          <span className="label-char" style={{'--index': 2}}>e</span>
                        </label>
                      </div>
                    </div>
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