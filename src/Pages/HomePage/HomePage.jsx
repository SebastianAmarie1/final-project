import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"
import Peer from "simple-peer"
import "./homepage.css"

function HomePage() {

  const { user } = useAuth()
  const { socket } = useSocket()

  const [stream, setStream] = useState() 
  const [searching, setSearching] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [roomId, setRoomId] = useState(null)

  const myVideo = useRef()
  const [myVideoToggled, setMyVideoToggled] = useState(false)
  const partnerVideo = useRef()
  const [partnerVideoToggled, setPartnerVideoToggled] = useState(false)
  const connectionRef = useRef()

  useEffect(() => {

    const settingMyStream = async() => { //sets up my stream.
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(stream)
        if (myVideo.current) {
          myVideo.current.srcObject = stream
        }
      } catch (error) {
        console.log(error)
      }
    }
    settingMyStream()

    socket.current.on("setRoomId", (data) => {
      setRoomId(data.roomId)
    })

  }, [])

  console.log(roomId)
  const searchForCall = () => {
    
    setSearching(true)


    socket.current.emit("search", {  
      id: user.id,
      gender: user.gender,
    })

  }

const stopSearch = () => {
  setSearching(false)
  setRoomId(null)
  socket.current.emit("leaveRoom", {  
    roomId: roomId,
  })
}

 
/////////////////////////////
  const endCall = () => {
    
  }

  const practise = () => {
    socket.current.emit("printUsers", {  
    })
  }


  let MyVideo = stream && <video className="home-video-me" ref={myVideo} autoPlay playsInline muted />
  let PartnersVideo = callAccepted && <video className="home-video-partner-video" ref={partnerVideo} autoPlay playsInline muted />
  
  return (
    <div className="home-main"> {/*Container for the whole page*/}
      <div className="home-container-headbar"> {/*Container for the title for the webpage */}
        <h2>Caller Name</h2><button onClick={practise}>See UsersHash</button>
        <div className="home-container-timer"> {/*Timer container */}
          <h3>1:00</h3>
        </div>
      </div>
      <div className="home-video">{/* Container for all the video components*/}
        <div className="home-video-questions">
          {!callAccepted ?
              searching ?
                  <div className="home-video-search" onClick={stopSearch}>
                    <h3 className="home-video-search-text">Searching ...</h3>
                  </div>
                  :
                  <div className="home-video-search" onClick={searchForCall}>
                    <h3 className="home-video-search-text">Click To Find Partner</h3>
                  </div>
                :
                <div className="home-video-partner" onClick={() => {setPartnerVideoToggled((oldValue) => !oldValue)}}>
                  {partnerVideoToggled && <div className="home-partner-toggled fcc"> 
                                              <button className="home-partner-endbutton" onClick={() => endCall()}>End Call</button>
                                          </div>
                  }
                  {PartnersVideo}
                </div> 
          }
          <div className="home-video-hints" >
            
          </div>
          <div className="home-video-user" onClick={() => {setMyVideoToggled((oldValue) => !oldValue)}}>
            {MyVideo}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage