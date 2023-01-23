import React, { useEffect, useState, useRef } from 'react'
import Peer from "simple-peer"

import "./homepage.css"
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"
import Counter from "../../Components/Counter"
import ShowProfile from "../../Components/showProfile/ShowProfile"
import Decision from "../../Components/decision/Decision"
import FinalPhase from '../../Components/finalPhase/FinalPhase'
import Online from "../../Components/Online-Hints/Online"

import endCallIcon from "../../Assets/homepage/homepage-end-call.webp"
import cameraOff from "../../Assets/homepage/homepage-camera-toggle-off.png"
import cameraOn from "../../Assets/homepage/homepage-camera-toggle-on.png"
import audioOn from "../../Assets/homepage/home-page-audio-on.png"
import audioOff from "../../Assets/homepage/home-page-audio-off.png"
import speakerOff from "../../Assets/homepage/home-speaker-off.png"
import speakerOn from "../../Assets/homepage/home-speaker-on.png"



function HomePage() {

  const { user, axiosAuth } = useAuth()
  const { socket } = useSocket()

  //Connections
  const [stream, setStream] = useState() 
  const [pStream, setPStream] = useState()
  const [searching, setSearching] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [roomId, setRoomId] = useState(null)
  const [partnerId, setPartnerId] = useState(null)
  const [partnerProfile, setPartnerProfile] = useState(null)
  const [initiator, setInitiator] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(null)
  const [callerSignal, setCallerSignal] = useState(null)

  //Camera Settings
  const [mute, setMute] = useState(false)
  const [partnerMute, setPartnerMute] = useState(false)
  const [viewCamera, setViewCamera] = useState(false)
  const [viewPartnerCamera, setPartnerViewCamera] = useState(false)//you switch off partners camera
  const [partnerCamera, setPartnerCamera] = useState(true)//partner switches off their camera

  //Streams and Videos
  const myVideo = useRef(null)
  const [myVideoToggled, setMyVideoToggled] = useState(false)
  const partnerVideo = useRef()
  const [partnerVideoToggled, setPartnerVideoToggled] = useState(false)
  const connectionRef = useRef()

  //Phases
  const [currentPhase, setCurrentPhase] = useState(1)// out of 3
  const [phaseTime, setPhaseTime] = useState([0, 0.05, 0.05, 0.05])
  const [showTimer, setShowTimer] = useState(false)
  const [decisionScreen, setDecisionScreen] = useState(false)

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
      setShowTimer(true)
      setPartnerId(data.partnerId)
    })

    socket.current.on("callEnded", () => {
      endCall()
    })
    socket.current.on('changeVideo', (data) => {
      setPartnerCamera(data.active);
      data.active ? partnerVideo.current.play() : partnerVideo.current.pause()
    });

    socket.current.on("onlineUsers", (data) => {
      setOnlineUsers(data.onlineUsers)
    })
  }, [])

  useEffect(() => {
    if(partnerId) {
      const getPartnerProfile = async() => {
        try {
          const res = await axiosAuth.post("/api/retrieve_user", { usersId: partnerId },
          { headers: 
              { authorization: "Bearer " + user.accessToken}
          })//sends a request to the server
          setPartnerProfile(res.data)
      } catch (error) {
          console.log(error)
      }
      }
      getPartnerProfile()
    }
  },[partnerId])

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
          id: user.id,
        })
      })
      
      peer.on("stream", (stream) => {//setting stream of partner
        setPStream(stream)
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream
          partnerVideo.current.pause()
        }
      })
      
      socket.current.on("callAccepted", (data) => { //for recieving answer
        setCallerSignal(data.signal)
        setCallAccepted(true)
        setShowTimer(true)
        setPartnerId(data.partnerId)
        peer.signal(data.signal)
      })
      
      connectionRef.current = peer
    }
  }, [initiator])

  useEffect(() => {
    if(partnerVideo.current){
      partnerVideo.current.srcObject = pStream
      partnerVideo.current.play()
    }
  },[decisionScreen])

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
          id: user.id
        })
      })
      
      peer.on("stream", (stream) => {
        setPStream(stream)
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream
          partnerVideo.current.pause()
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
    viewPartnerCamera ? partnerVideo.current.play() : partnerVideo.current.pause()
  }


/// PHASES /// 
const handleCountdownEnd = () => {
  setShowTimer(false)
  setDecisionScreen(true)
}

const nextPhase = () => {
  if (currentPhase <= 3){
    setCurrentPhase((old) => old + 1)
    setShowTimer(true)
    setDecisionScreen(false)
  }

}


  let MyVideo = <video onClick={() => {setMyVideoToggled((oldValue) => !oldValue)}} className="home-video-me" ref={myVideo} autoPlay playsInline/>
  let PartnersVideo = <video onClick={() => {setPartnerVideoToggled((oldValue) => !oldValue)}} className="home-video-partner-video" ref={partnerVideo} autoPlay playsInline muted/>

  return (
    <div className="home-main"> {/*Container for the whole page*/}
    
      <div className="home-container-headbar"> {/*Container for the title for the webpage */}
        <h2>{callAccepted ? partnerProfile?.username : 'Currently Not In Call'}</h2>
        <div className="home-container-timer"> {/*Timer container */}
          {showTimer && <Counter time={phaseTime[currentPhase]} onCountdownEnd={handleCountdownEnd}/>}
        </div>
      </div>

      <div className="home-main-container">{/* Container for all the video components*/}
        <div className="home-video-questions">
          {!callAccepted ?
              searching ?
                  <div className="home-video-search" onClick={stopSearch}>
                    <div className="loader home-video-loader">
                        <div className="face">
                            <div className="circle"></div>
                        </div>
                        <div className="face">
                            <div className="circle"></div>
                        </div>
                    </div>
                    <h3 className="home-video-search-text">Searching</h3>
                  </div>
                  :
                  <div className="home-video-search" onClick={searchForCall}>
                    <div className="home-video-search-static"/>
                    <h3 className="home-video-search-text">Click To Find Partner</h3>
                    <div className="home-video-search-static home-video-search-static-secondary"/>
                  </div>
                :
                (currentPhase === 3 && decisionScreen)
                ?
                  <FinalPhase roomId={roomId} endCall={endCall} partnerId={partnerId}/>
                :
                  decisionScreen
                    ?
                      <Decision roomId={roomId} nextPhase = {nextPhase} currentPhase={currentPhase}/>
                    :
                      currentPhase === 1 
                      ?
                        <ShowProfile partnerProfile={partnerProfile} />
                      :
                      <div className="home-video-partner fcc">
                        <div onClick={() => {setPartnerVideoToggled((oldValue) => !oldValue)}} className={`hideCamera fcc ${partnerCamera && 'hide'}`} >
                          <h2 className="hideCamera-title">Camera Turned Off</h2> 
                        </div>
                        <div onClick={() => {setPartnerVideoToggled((oldValue) => !oldValue)}} className={`hideCamera fcc ${!viewPartnerCamera && 'hide'}`}>
                          <h2 className="hideCamera-title">Hiding Partners Camera</h2> 
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
          <Online onlineUsers={onlineUsers} />
          <div className="home-video-user">
            <div onClick={() => {setMyVideoToggled((oldValue) => !oldValue)}} className={`hideCamera fcc ${!viewCamera && 'hide'}`}>
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