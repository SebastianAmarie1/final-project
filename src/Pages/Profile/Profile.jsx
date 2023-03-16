import React, { useState, useRef } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { validateProfileDetailsData, validateProfileData } from "../../Components/Validators"
import axios from "../../Contexts/axiosConfig"

import "./ProfileCss.css"

import noProfileIcon from "../../Assets/default-user-image.jpg"
import { useEffect } from 'react'

function Profile() {

  const { user, axiosAuth, setUser, setFlag } = useAuth()

  const [newProfilePic, setNewProfilePic] = useState(null)
  const [switcherToggle, setSwitcherToggle] = useState(true)
  const [errors, setErrors] = useState(null)

  const [fName, setFname] = useState("")
  const [lName, setLname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")

  const [bio, setBio] = useState("")
  const [hobbie1, setHobbie1] = useState("")
  const [hobbie2, setHobbie2] = useState("")
  const [hobbie3, setHobbie3] = useState("")
  const [fact1, setFact1] = useState("")
  const [fact2, setFact2] = useState("")
  const [lie, setLie] = useState("")


  useEffect(() => {
    if (switcherToggle) {
      if(user.id){
        setFname(user.fname)
        setLname(user.lname)
        setEmail(user.email)
        setPhone(user.phonenumber)
        setRegion(user.region)
      }
    } else {
      if (user.id){
        setBio(user.profile.bio)
        setHobbie1(user.profile.hobbie1)
        setHobbie2(user.profile.hobbie2)
        setHobbie3(user.profile.hobbie3)
        setFact1(user.profile.fact1)
        setFact2(user.profile.fact2)
        setLie(user.profile.lie)
      }
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
      profile: {
        ...user.profile,
        profile_pic: res.data.profile_pic,
      }
    })
    setNewProfilePic(null)
  }

  const isValidUsernameEmail = async() => {
    try {
      const res = await axios.post("/api/checkue", { username: null, email})
      return res.data
    } catch (err) {
        setErrors([err.message])
    }
  }

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
      },
      { headers: 
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

  useEffect(() => {
    console.log(errors)
  }, [errors])

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