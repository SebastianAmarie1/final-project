import React, { useState, useEffect, memo } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"

import "./FinalPhaseCss.css"

function FinalPhase({ roomId, endCall, partnerId, skipCall }) {

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
      handleFollow()
    }
  },[answer, response])

  useEffect(() => {
    const checkFollowing = () => {
      if (user.friendslist){
        user.friendslist.forEach((value) => {
          if (JSON.stringify(partnerId) === value){
            setFollowing(true)
          }
        })
      }
    }

    checkFollowing()
  },[user.friendslist])
  
  const handleAdd = () => {
    setAnswer(true)

    socket.current.emit("Follow", {
      roomId: roomId,
      userDetails: user
    })
  }

  const handleFollow = async () => {
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
      }
      endCall()
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <div className="final-container">
      <div className="final-main fcc">
        <h1>Final Phase</h1>
        <h2>{following ? 'You are already following this user' : 'Would you like to add this user?'}</h2>
        <div className="final-body fcc">
          { following 
            ? 
              <div className="final-button-container ">
                <button onClick={skipCall} className="final-button final-button-p"> Find Next Partner</button>
                <div className="final-button-blur final-button-blur-p" />
              </div>
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
                  <button onClick={skipCall} className="final-button final-button-p"> Find Next User</button>
                  <div className="final-button-blur final-button-blur-p" />
                </div>
              </>
          }
        </div>
      </div>
      <div className="home-video-search-footer fcc">
          <button onClick={skipCall} className="home-video-search-buttons button-small">Skip</button>
          <button onClick={endCall} className="home-video-search-buttons end-call button-small"> End Call</button>
      </div>
    </div>
  )
}

export default memo(FinalPhase)