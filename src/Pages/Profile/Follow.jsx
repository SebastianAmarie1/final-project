import React, { useEffect, useState } from 'react'
import axios from "../../Contexts/axiosConfig"
import { useAuth } from "../../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import noProfileIcon from "../../Assets/noProfileIcon.png"

function Follow() {

  const { user, setUser, setFlag, axiosAuth } = useAuth()
  const [allUsers, setAllUsers] = useState()
  const navigate = useNavigate()

  




  const followerUsers = allUsers
  ? allUsers.map((current) => {

    let following = false

    if(user.followinglist){
      if (user.followinglist.includes(JSON.stringify(current.users_id))) {
        following = true
      }
    }
    if (following){
      return (
        <div className="friends-individual-user-box" key={current.users_id}>
          <img src={noProfileIcon} className="following-individual-pp"></img>
          <div className="friends-individual-name">
            <h2 className="friends-individual-user-name">{current.username}</h2>
            <h4>{current.fname}</h4>
          </div>
          <h1 className="friends-individual-arrow">&gt;</h1>
        </div>
      )
    } 
    })
  : <h1>Loading ...</h1>

  return (
    <>
      <div className="navigation-spacer"></div>
      <div className="freinds-main-box">
          {followerUsers}
          <h5 className="friends-main-message">Add more friends</h5>
      </div>
    </>
  )
}

export default Follow