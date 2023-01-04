import React, { useState, useEffect } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"

function FinalPhase({ roomId, endCall }) {

  const { user, setUser, setFlag, axiosAuth } = useAuth()
  const { socket } = useSocket()


  const [answer, setAnswer] = useState(false)
  const [response, setResponse] = useState(false)
  const [partnerDetails, setPartnerDetails] = useState(null)

  useEffect(() => {
    socket.current.on("responseFollow", (data) => {
      setResponse(true)
      setPartnerDetails(data.userDetails)
    })
  },[])

  useEffect(() => {
    if (answer && response){
      followRequest()
    }
    
  },[answer, response])

  const handleAdd = () => {
    setAnswer(true)

    socket.current.emit("Follow", {
      roomId: roomId,
      userDetails: user
    })
  }

  //used to follow a user and create a blank conversation
  const followRequest = async() => {
    try {
      const res = await axiosAuth.post("/api/follow", {id: user.id, followedUser: partnerDetails.id}, 
      { headers: 
        { authorization: "Bearer " + user.accessToken}
      })
      
      setFlag(true)
      if (user.friendslist === null){
        setUser({...user, friendslist: JSON.stringify(partnerDetails.id)})
      } else{
        setUser({...user, friendslist: [...user.friendslist, JSON.stringify(partnerDetails.id)]})
      }
    } catch (error) {
      console.log(error)
    }

    try {
      const response = await axiosAuth.post("/api/create_conversation", {userDetails: user, partnerDetails: partnerDetails}, 
      { headers: 
        { authorization: "Bearer " + user.accessToken}
      })
    } catch (error) {
      console.log(error)
    }
    endCall()
  }


  return (
    <div className="showp-container">
      <h2>FINAL PHASE</h2>
      <h3>Would you like to add this user?</h3>
      <button onClick={handleAdd}>Add User!</button>
    </div>
  )
}

export default FinalPhase