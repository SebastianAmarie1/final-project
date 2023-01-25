import React, { useState, useEffect } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"

import "./FinalPhaseCss.css"

function FinalPhase({ roomId, endCall, partnerId }) {

  const { user, setUser, setFlag, axiosAuth } = useAuth()
  const { socket } = useSocket()


  const [answer, setAnswer] = useState(false)
  const [response, setResponse] = useState(false)
  const [partnerDetails, setPartnerDetails] = useState(null)
  const [following, setFollowing] = useState(false)

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

  useEffect(() => {
    const checkFollowing = () => {
      if (user.friendslist){
        user.friendslist.forEach((value) => {
          console.log(value, partnerId, "ran")
          if (JSON.stringify(partnerId) == JSON.stringify(value)){
            setFollowing(true)
            console.log("Ran")
          }
        })}
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
  console.log(following)

  //used to follow a user and create a blank conversation
  const followRequest = async() => {
    try {
      const res = await axiosAuth.post("/api/follow", {id: user.id, followedUser: partnerDetails.id}, 
      { headers: 
        { authorization: "Bearer " + user.accessToken}
      })
      
      if (res.data.flag) {
        setFlag(true)
        setUser((prev) => {
          return {
            ...prev,
            friendslist: res.data.user.friendslist
          }
        })
        
        if(partnerDetails.id < user.id){
          const response = await axiosAuth.post("/api/create_conversation", {id: user.id, pid: partnerDetails.id}, 
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
    <div className="final-container">
      <div className="final-main fcc">
        <h1>Final Phase</h1>
        <h2>Would you like to add this user?</h2>
        <div className="final-body fcc">
          { following 
            ? 
              <button>You are Already Following This user!</button> 
            : 
            answer 
            ?
            <>
              <div className="loader home-video-loader">
                  <div className="face">
                      <div className="circle"></div>
                  </div>
                  <div className="face">
                      <div className="circle"></div>
                  </div>
              </div>
              <h3 className="home-video-search-text">Waiting For Partner Response</h3>
            </>
            :
              <>
                <div className="final-button-container">
                  <button className="final-button final-button-p" onClick={handleAdd}>Add User!</button>
                  <div className="final-button-blur final-button-blur-p" />
                </div>
                <div className="final-button-container ">
                  <button className="final-button final-button-p"> Find Next User</button>
                  <div className="final-button-blur final-button-blur-p" />
                </div>
              </>
          }
        </div>
      </div>
    </div>
  )
}

export default FinalPhase