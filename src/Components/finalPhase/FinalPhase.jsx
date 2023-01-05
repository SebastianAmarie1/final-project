import React, { useState, useEffect } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"

function FinalPhase({ roomId, endCall, partnerId }) {

  const { user, setUser, setFlag, axiosAuth } = useAuth()
  const { socket } = useSocket()


  const [answer, setAnswer] = useState(false)
  const [response, setResponse] = useState(false)
  const [partnerDetails, setPartnerDetails] = useState(null)
  const [initiator, setInitiator] = useState(false)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    socket.current.on("responseFollow", (data) => {
      setResponse(true)
      setPartnerDetails(data.userDetails)
      setInitiator(true)
    })

  },[])

  useEffect(() => {
    if (answer && response){
      followRequest()
    }
    
  },[answer, response])


  useEffect(() => {
    const checkFollowing = () => {
      if (user.friendslist){
        console.log(user.friendslist, "friendsList")
      }
    }
    checkFollowing()
  },[user])


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

      console.log(res.data.flag)
      
      if (res.data.flag) {
        setFlag(true)
        setUser(res.data.user)
        
        if(initiator){
          const response = await axiosAuth.post("/api/create_conversation", {userDetails: user, partnerDetails: partnerDetails}, 
          { headers: 
            { authorization: "Bearer " + user.accessToken}
          })
        }
      }

    } catch (error) {
      console.log(error)
    }

    endCall()
  }

  return (
    <div className="showp-container">
      <h2>FINAL PHASE</h2>
      <h3>Would you like to add this user?</h3>
      { following ? <button>You are Already Following This user!</button> : <button onClick={handleAdd}>Add User!</button>}
        
    </div>
  )
}

export default FinalPhase