import React, { useEffect, useState } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import noProfileIcon from "../../Assets/noProfileIcon.png"
import "./FollowCss.css"

function Follow() {

  const { user, axiosAuth } = useAuth()
  const [conversations, setConversations] = useState(null)
  const navigate = useNavigate()

  
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
  ? conversations.map((current) => {
      const id = current.members.filter((value) => value != user.id)[0]
      const cname = current.members_names.filter((value) => value != user.username)[0]
      console.log(current.conversation_id)
      return (
        <div onClick={() => {navigate(`/homepage/follow/chat/${current.conversation_id}`, { state: {conversationId: current.conversation_id, recieverId: id} })}} className="friends-individual-user-box" key={id}>
          <img src={noProfileIcon} className="following-individual-pp"></img>
          <div className="friends-individual-name">
            <h2 className="friends-individual-user-name">{cname}</h2>
          </div>
          <h1 className="friends-individual-arrow">&gt;</h1>
        </div>
      )
    })
  : <h1>Loading ...</h1>

  return (
    <div className="freinds-main-box">
      <div className="friends-container">
        {followerUsers}
        <h5 className="friends-main-message">Add more friends</h5>
      </div>
    </div>
  )
}

export default Follow