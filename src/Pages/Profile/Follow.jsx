import React, { useEffect, useState } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import noProfileIcon from "../../Assets/noProfileIcon.png"
import "./FollowCss.css"

function Follow() {

  const { user, axiosAuth } = useAuth()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState(null)
  const [searchUser, setSearchUser] = useState("")
  
  useEffect(() => {
    const getConvos = async() => {
      try {
          const res = await axiosAuth.post("/api/retrieve_conversations", { id: user.id },
          { headers: 
              { authorization: "Bearer " + user.accessToken}
          })//sends a request to the server
          setConversations(res.data)
      } catch (error) {
          console.log(error)
      }
    }
    getConvos()
  },[user])

  const followerUsers = conversations //filter for most recent
  ? conversations.filter((convo) => {
        //fix filter
        return convo
      
    }).map((current) => {

      const partner = current.members.filter((value) => value.users_id != user.id)[0]

      const date = current.last_message_date?.split("T")[0]
      const time = current.last_message_date?.split("T")[1].split(".")[0] 
      
      return (
        <div onClick={() => {navigate(`/homepage/follow/chat/${current.conversation_id}`, { state: { conversationId: current.conversation_id, recieverId: partner.users_id, cname: partner.username, profile_pic: partner.profile_pic } })}} className="friends-individual-user-box" key={partner.users_id}>
          <img src={partner.profile_pic} className="following-individual-pp"></img>
          <div className="friends-individual-name">
            <h2 className="friends-individual-user-name">{partner.username}</h2>
            {current.last_message 
              ?
              <div className="friends-individual-user-lmsg"> 
                <p className="friends-individual-user-lmsg-msg">{current.last_message}</p>
                <div className="friends-individual-user-lmsg-date">
                  <p>{date} {time}</p>
                </div>
              </div>
              :
              <p className="friends-individual-user-lmsg-msg">Start a new chat with this person</p>
            }
          </div>
          <h1 className="friends-individual-arrow">&gt;</h1>
        </div>
      )
    })
  : <h1>Loading ...</h1>

  return (
    <div className="freinds-main-box">
      <div className="friends-container">
        <div className="friends-container-header">
          <h1 onClick={() => {navigate(`/homepage/`)}} className="chat-header-back-f">&gt;</h1>
          <input 
            className="friends-container-header-search" 
            placeholder="Search for user..."
            value={searchUser}
            onChange ={(e) => setSearchUser(e.target.value)} 
          />
        </div>
        {followerUsers}
        <h5 className="friends-main-message">Add more friends</h5>
      </div>
    </div>
  )
}

export default Follow