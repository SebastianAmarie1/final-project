import React, { useEffect, useState } from 'react'
import axios from "../Contexts/axiosConfig"
import { useAuth } from "../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import noProfileIcon from "../Assets/noProfileIcon.png"

function Follow() {

  const { user, setUser, setFlag, axiosAuth } = useAuth()
  const [allUsers, setAllUsers] = useState()
  const navigate = useNavigate()

  //used to get all the users from the DB
  const getAllUsers = async() => {
    try {
        const res = await axios.get("/api/allusers")
        setAllUsers(res.data)
    } catch (error) {
        console.log(error)
    }
  }
  //runs the get users once
  useEffect(() => {
    getAllUsers()
  },[])

  //open the chat with a specific person
  const handleOpenMessages = async(secondaryUser) => {
    try {
      const res = await axiosAuth.post("/api/retrieve_specific_conversation", { primaryUser: user.id, secondaryUser: secondaryUser },
      { headers: 
        { authorization: "Bearer " + user.accessToken}
      })
      console.log(res.data.conversation_id)
      navigate(`/homepage/follow/chat/${res.data.conversation_id}`, { state: {conversationId: res.data.conversation_id, recieverId: secondaryUser} })
    } catch (error) {
      console.log(error)
    }
  }

  //used to follow a user and create a blank conversation
  const followRequest = async(addedId) => {
    try {
      const res = await axiosAuth.post("/api/follow", {id: user.id, followedUser: addedId}, 
      { headers: 
        { authorization: "Bearer " + user.accessToken}
      })
      
      setFlag(true)
      if (user.followinglist === null){
        setUser({...user, followinglist: JSON.stringify(addedId)})
      } else{
        setUser({...user, followinglist: [...user.followinglist, JSON.stringify(addedId)]})
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await axiosAuth.post("/api/create_conversation", {primaryUser: user.id, secondaryUser: addedId}, 
      { headers: 
        { authorization: "Bearer " + user.accessToken}
      })
    } catch (error) {
      console.log(error)
    }
  }

  //used to unfollow a user
  const unFollowRequest = async(unaddedId) => {

    let newList = user.followinglist.filter(filtered => filtered !== JSON.stringify(unaddedId))

    try {
      const res = await axiosAuth.post("/api/unfollow", {id: user.id, newList: newList}, 
      { headers: 
        { authorization: "Bearer " + user.accessToken}
      })
      setUser({...user, followinglist: [...newList]})
    } catch (error) {
      console.log(error)
    }
  }

  // This displays all users who the user is following
  const displayAllUsers = allUsers
  ? allUsers.filter((current) => current.users_id !== user.id).map((fr) => {

    let following = false

    if(user.followinglist){
      if (user.followinglist.includes(JSON.stringify(fr.users_id))) {
        following = true
      }
    }
    return (
      <div className="friends-individual-user-box" key={fr.users_id}>
          <h1 className="friends-individual-user-name">{fr.username}</h1>
          { following ? <button onClick={() => unFollowRequest(fr.users_id)} className="friends-individual-user-button">Unfollow</button>
                      : <button onClick={() => followRequest(fr.users_id)} className="friends-individual-user-button">Follow</button>  
        }
      </div>
    )
  })
  : <h1>Loading...</h1>

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
        <div onClick={() => handleOpenMessages(current.users_id)} className="friends-individual-user-box" key={current.users_id}>
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
          {displayAllUsers}
          <h5 className="friends-main-message">Add more friends</h5>
      </div>
    </>
  )
}

export default Follow