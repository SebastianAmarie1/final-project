import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"
import Peer from "simple-peer"
import "./homepage.css"

import endCallIcon from "../../Assets/homepage/homepage-end-call.webp"
import cameraOff from "../../Assets/homepage/homepage-camera-toggle-off.png"
import cameraOn from "../../Assets/homepage/homepage-camera-toggle-on.png"
import audioOn from "../../Assets/homepage/home-page-audio-on.png"
import audioOff from "../../Assets/homepage/home-page-audio-off.png"
import speakerOff from "../../Assets/homepage/home-speaker-off.png"
import speakerOn from "../../Assets/homepage/home-speaker-on.png"




function HomePage() {

  const { user } = useAuth()
  const { socket } = useSocket()

  const [stream, setStream] = useState() 
  const [searching, setSearching] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [roomId, setRoomId] = useState(null)
  const [initiator, setInitiator] = useState(null)
  const [callerSignal, setCallerSignal] = useState(null)

  const [mute, setMute] = useState(false)
  const [partnerMute, setPartnerMute] = useState(false)
  const [viewCamera, setViewCamera] = useState(false)
  const [viewPartnerCamera, setPartnerViewCamera] = useState(false)
  const [partnerCamera, setPartnerCamera] = useState(true)

  const myVideo = useRef(null)
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
          myVideo.current.volume = 0
        }
      } catch (error) {
        console.log(error)
      }
    }
    settingMyStream()

    socket.current.on("setRoomId", (data) => {
      setRoomId(data.roomId)
      setInitiator(data.initiator)
    })

    socket.current.on("answerUser", (data) => {
      setCallerSignal(data.signal)
    })

    socket.current.on("callEnded", () => {
      endCall()
    })
    socket.current.on('changeVideo', (data) => {
      setPartnerCamera(data.active);
      data.active ? partnerVideo.current.play() : partnerVideo.current.pause()
    });
  }, [])

//// initiating the call ////

const searchForCall = () => {
    
  setSearching(true)

  socket.current.emit("search", {  
    id: user.id,
    gender: user.gender,
  })
}

  useEffect(() => { 
    if(initiator) {
      const peer = new Peer({ // create peer
        initiator: true,
        trickle: false,
        stream: stream
      })
      
      peer.on("signal", (data) => {//sending signal to reciever
        socket.current.emit("callUser", {
          signal: data,
          roomId: roomId,
        })

        console.log("RAN IN SIGNAL")
      })
      
      peer.on("stream", (stream) => {//setting stream of partner
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream
        }
      })
      
      socket.current.on("callAccepted", (data) => { //for recieving answer
        setCallerSignal(data.signal)
        setCallAccepted(true)
        peer.signal(data.signal)
      })
      
      connectionRef.current = peer
    }
  }, [initiator])

//// recieving the call ////
  useEffect(() => { 
    if(callerSignal != null & initiator === false) {
      setCallAccepted(true)

      const peer = new Peer({ //create peer
        initiator: false,
        trickle: false,
        stream: stream
      })

      peer.on("signal", (data) => {
        socket.current.emit("answerCall", {
          signal: data,
          roomId: roomId,
        })
      })
      
      peer.on("stream", (stream) => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream
        }
      })

      peer.signal(callerSignal)
      connectionRef.current = peer
    }

  }, [callerSignal])

const stopSearch = () => {
  setSearching(false)
  setRoomId(null)
  socket.current.emit("leaveRoom", {  
    roomId: roomId,
  })
}
 
//// End Call ////
  const endCall = () => {

    socket.current.emit("endCall", {
      roomId: roomId,
    })

    connectionRef.current = null
    partnerVideo.current = null
    setPartnerViewCamera(false)
    setPartnerMute(false)
    setCallerSignal(null)
    setInitiator(null)
    setRoomId(null)
    setCallAccepted(false)
    setSearching(false)
  }

///// Camera settings /////

  const muteAudio = () => {
    if (myVideo.current) {
      setMute((prev) => !prev)
      myVideo.current.muted = !myVideo.current.muted;
      
    }
  }
  const mutePartnerAudio = () => {
    if (partnerVideo.current) {
      setPartnerMute((prev) => !prev)
      partnerVideo.current.volume = partnerMute ? 1 : 0;
    }
  }
  const showCamera = async() => {
    setViewCamera((prev) => !prev)
    viewCamera ? myVideo.current.play() : myVideo.current.pause()

    socket.current.emit("editVideo", {
      active: viewCamera,
      roomId: roomId,
    })

  }
  const showPartnerCamera = () => {
    setPartnerViewCamera((prev) => !prev)
  }

  const practise = () => {
    socket.current.emit("printUsers", {})
  }

  let MyVideo = <video onClick={() => {setMyVideoToggled((oldValue) => !oldValue)}} className="home-video-me" ref={myVideo} autoPlay playsInline/>
  let PartnersVideo = <video onClick={() => {setPartnerVideoToggled((oldValue) => !oldValue)}} className="home-video-partner-video" ref={partnerVideo} autoPlay playsInline muted />
  
  return (
    <div className="home-main"> {/*Container for the whole page*/}
      <div className="home-container-headbar"> {/*Container for the title for the webpage */}
        <h2>{callAccepted ? 'CHANGE TO USER NAME' : 'Currently Not In Call'}</h2>
        <button onClick={practise}>
          Practise
        </button>
        <div className="home-container-timer"> {/*Timer container */}
          <h3>1:00</h3>
        </div>
      </div>
      <div className="home-main-container">{/* Container for all the video components*/}
        <div className="home-video-questions">
          {!callAccepted ?
              searching ?
                  <div className="home-video-search" onClick={stopSearch}>
                    <div className="search-outer-circle fcc outer-circle-animation"></div>
                    <div className="search-middle-circle fcc middle-circle-animation"></div>
                    <div className="search-inner-circle fcc inner-circle-animation"></div>
                    <h3 className="home-video-search-text">Searching</h3>
                  </div>
                  :
                  <div className="home-video-search" onClick={searchForCall}>
                    <div className="search-outer-circle fcc">
                      <div className="search-middle-circle fcc">
                        <div className="search-inner-circle fcc">
                          <h3 className="home-video-search-text">Click To Find Partner</h3>
                        </div> 
                      </div>
                    </div>
                  </div>
                :
                <div className="home-video-partner fcc">
                  <div className={`hideCamera fcc ${partnerCamera && 'hide'}`}>
                    <h2 className="hideCamera-title">Camera Turned Off</h2>
                  </div>
                  {partnerVideoToggled 
                    && 
                      <div className="home-partner-toggled"> 
                        <button className="home-partner-button" >Skip</button>
                        <button className="home-partner-button report-button" >Report</button>
                      </div>
                  }
                  {PartnersVideo}
                  {partnerVideoToggled 
                    && 
                      <div className="home-partner-toggled-footer fcc">
                        <div className="home-partner-toggled-footer-inner">
                          {partnerMute
                          ?<img src={speakerOff} className="home-footer-button" onClick={mutePartnerAudio}/>  
                          :<img src={speakerOn} className="home-footer-button home-speaker-on" onClick={mutePartnerAudio}/>
                          }
                          <img src={endCallIcon} className="home-endbutton home-footer-button" onClick={() => endCall()} />
                          {viewPartnerCamera
                          ?<img src={cameraOff} className="home-footer-button" onClick={showPartnerCamera}/>  
                          :<img src={cameraOn} className="home-footer-button" onClick={showPartnerCamera}/>  
                          }
                        </div> 
                      </div>
                  }
                </div> 
          }
          <div className="home-video-hints" >
          </div>
          <div className="home-video-user">
            <div className={`hideCamera fcc ${!viewCamera && 'hide'}`}>
              <h2 className="hideCamera-title">Camera Turned Off</h2>
            </div>
            {MyVideo}
            {myVideoToggled 
              && <>
                <div className="home-partner-toggled-footer fcc">
                  <div className="home-partner-toggled-footer-inner">
                    {mute
                      ?<img src={audioOff} className="home-footer-button" onClick={muteAudio}/>  
                      :<img src={audioOn} className="home-footer-button" onClick={muteAudio}/>
                    }
                    {viewCamera
                      ?<img src={cameraOff} className="home-footer-button" onClick={showCamera}/>  
                      :<img src={cameraOn} className="home-footer-button" onClick={showCamera}/>  
                    } 
                  </div> 
                </div>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage