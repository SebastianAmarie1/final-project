import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"
import Peer from "simple-peer"
import "./homepage.css"

function HomePage() {

  const { user } = useAuth()
  const { socket } = useSocket()

  const [stream, setStream] = useState() 
  const [recievingCall, setReceivingCall] = useState(false) 
  const [searching, setSearching] = useState(false)
  const [caller, setCaller] = useState()
  const [name, setName] = useState("")
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)

  const myVideo = useRef()
  const [myVideoToggled, setMyVideoToggled] = useState(false)
  const partnerVideo = useRef()
  const [partnerVideoToggled, setPartnerVideoToggled] = useState(false)
  const connectionRef = useRef()

  useEffect(() => {

    const settingMyStream = async() => {
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

  }, [])

  useEffect(() => {
    if (recievingCall) {
      acceptCall()
    }
  }, [recievingCall])


  const addToSearch = () => {
    setSearching(true)

    if (user.gender === "Male") {
      console.log("Ran meth")
      callUser()
    }
  }

  const callUser = () => {
    const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})

    peer.on("signal", (data) => {
			socket.current.emit("callUser", {
				signal: data,
				id: user.id,
        name: user.username
			})
		})

    peer.on("stream", (stream) => {
			if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream
      }
    })

    socket.current.on("callAccepted", (signal) => {
      console.log("CALL ACCEPTED")
			setCallAccepted(true)
			peer.signal(signal)
		})

    connectionRef.current = peer
  }
//////////////////////////
  const acceptCall = () => {
    console.log("ran")
    setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.current.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream
      }		
    })

		peer.signal(callerSignal)
		connectionRef.current = peer
  }
/////////////////////////////
  const endCall = () => {
    setReceivingCall(false)
    setCaller()
    setName("")
    setSearching(false)
    setCallerSignal()
    setCallAccepted(false)
    partnerVideo.current.srcObject = null
    
    socket.current.emit("endCall", {to: caller, gender: user.gender})
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
                            <div className="home-video-search">
                              <h3 className="home-video-search-text">Searching ...</h3>
                            </div>
                            :
                            <div className="home-video-search"  onClick={addToSearch}>
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