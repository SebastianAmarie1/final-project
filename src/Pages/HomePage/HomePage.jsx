import React, { useEffect, useState, useRef, lazy, Suspense } from 'react'
import Peer from "simple-peer"

import "./homepage.css"
import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from "../../Contexts/socketContext"
import axios from "../../Contexts/axiosConfig"



import endCallIcon from "../../Assets/homepage/homepage-end-call.webp"
import cameraOff from "../../Assets/homepage/homepage-camera-toggle-off.png"
import cameraOn from "../../Assets/homepage/homepage-camera-toggle-on.png"
import audioOn from "../../Assets/homepage/home-page-audio-on.png"
import audioOff from "../../Assets/homepage/home-page-audio-off.png"
import speakerOff from "../../Assets/homepage/home-speaker-off.png"
import speakerOn from "../../Assets/homepage/home-speaker-on.png"

const Counter = lazy(() => import("../../Components/Counter"))
const ShowProfile = lazy(() => import("../../Components/showProfile/ShowProfile"))
const Decision = lazy(() => import("../../Components/decision/Decision"))
const FinalPhase = lazy(() => import("../../Components/finalPhase/FinalPhase"))
const Online = lazy(() => import("../../Components/Online-Hints/Online"))
const Hints = lazy(() => import("../../Components/Online-Hints/Hints"))
const Loader = lazy(() => import("../../Components/Loader"))

function HomePage() {

  const { user, axiosAuth, connectionRef, setRoomId, roomId } = useAuth()
  const { socket } = useSocket()

  //Connections
  const [stream, setStream] = useState() 
  const [pStream, setPStream] = useState(null)
  const [searching, setSearching] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
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

  //Phases
  const [currentPhase, setCurrentPhase] = useState(1)// out of 3
  const phaseTime = [0, 0.05, 0.05, 500]
  const [showTimer, setShowTimer] = useState(false)
  const [decisionScreen, setDecisionScreen] = useState(false)

  //Phase 3
  const [question, setQuestion] = useState(null)

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

    socket.current.emit("seeOnlineUsers")

    socket.current.on("recieveOnlineUsers", (data) => {
      setOnlineUsers(data.onlineUsers)
    }) 

    socket.current.on("callFailed", () => {
      console.log("RAN FAILED CALL")
      stopSearch()
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
    
    if (connectionRef.current){
      connectionRef.current = undefined
    }
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    if (peer){
      peer.on("signal", (data) => {
        socket.current.emit("callUser", {
          signal: data,
          roomId: roomId,
          id: user.id,
        });
      });
    }
    
    peer.on("stream", (stream) => {
      setPStream(stream);
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
        partnerVideo.current.pause();
      }
    });

    let flag = false
    socket.current.on("callAccepted", (data) => {
      if (!flag){
        setCallerSignal(data.signal);
        setCallAccepted(true);
        setShowTimer(true);
        setPartnerId(data.partnerId);
        flag = true
        connectionRef.current.signal(data.signal);
      }
    });

    peer.on('error', (error) => {
      console.log(error)
      endCall()
    });
    
    connectionRef.current = peer;
  }
  }, [initiator]);

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

      peer.on('error', (error) => {
        console.log(error)
        endCall()
      });

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
  const endCall = async() => {
    if (connectionRef.current) {

      socket.current.emit("endCall", {
        roomId: roomId,
      });

      connectionRef.current.on('close', () => {
        // clean up resources when the connection is closed
      });
      connectionRef.current.destroy();

      if (partnerVideo.current) {
        partnerVideo.current.srcObject = null;
      }

      setPStream(null);
      setPartnerId(null);
      setPartnerProfile(null);
      setPartnerViewCamera(false);
      setPartnerMute(false);
      setCallerSignal(null);
      setInitiator(null);
      setRoomId(null);
      setCallAccepted(false);
      setSearching(false);
      setDecisionScreen(false);
      setCurrentPhase(1);
      setShowTimer(false);
    }
  }

  const skipCall = async () => {
    endCall()
    searchForCall()
  }

///// Camera settings /////
  const muteAudio = () => {
    if (myVideo.current) {
      setMute((prev) => !prev)
      const stream = myVideo.current.srcObject;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
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

  const getQuestion = async() => {
    const options = {
        method: 'GET',
        url: 'https://would-you-rather.p.rapidapi.com/wyr/random',
        headers: {
          'X-RapidAPI-Key': 'd28369a221mshce7373ca2e84dcep1d306cjsncafae953c3ba',
          'X-RapidAPI-Host': 'would-you-rather.p.rapidapi.com'
        }
      };
      
      const res = await axios.request(options)
      setQuestion(res.data[0].question)
  }  

  useEffect(() => { // UseEffect for Phase 3 Questions
    if (currentPhase === 3){
      setQuestion("Question 1")

      setTimeout(() => {
        console.log("Question 2")
      },30000)

      setTimeout(() => {
        console.log("Question 3")
      },60000)
      
      setTimeout(() => {
        console.log("Question 4")
      },90000)
    } 
  },[currentPhase]) 

  useEffect(() => {
    if (currentPhase === 3){
      console.log(question)
    }
  },[question])


  let MyVideo = <video onClick={() => {setMyVideoToggled((oldValue) => !oldValue)}} className="home-video-me" ref={myVideo} autoPlay playsInline/>
  let PartnersVideo = <video onClick={() => {setPartnerVideoToggled((oldValue) => !oldValue)}} className="home-video-partner-video" ref={partnerVideo} autoPlay playsInline />

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
                    <Loader />
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
                  <FinalPhase roomId={roomId} endCall={endCall} partnerId={partnerId} skipCall={skipCall}/>
                :
                  decisionScreen
                    ?
                      <Decision roomId={roomId} nextPhase = {nextPhase} currentPhase={currentPhase} endCall={endCall} skipCall={skipCall}/>
                    :
                      currentPhase === 1 
                      ?
                        <ShowProfile endCall={endCall} skipCall={skipCall} partnerProfile={partnerProfile} />
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
                                ?<img loading="lazy" src={speakerOff} className="home-footer-button" onClick={mutePartnerAudio}/>  
                                :<img loading="lazy" src={speakerOn} className="home-footer-button home-speaker-on" onClick={mutePartnerAudio}/>
                                }
                                <img loading="lazy" src={endCallIcon} className="home-endbutton home-footer-button" onClick={() => endCall()} />
                                {viewPartnerCamera
                                ?<img loading="lazy" src={cameraOff} className="home-footer-button" onClick={showPartnerCamera}/>  
                                :<img loading="lazy" src={cameraOn} className="home-footer-button" onClick={showPartnerCamera}/>  
                                }
                              </div> 
                            </div>
                        }
                  </div> 
          }
          {callerSignal 
            ? 
              <Hints />
            :
              <Online onlineUsers={onlineUsers} />
          }
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
                      ?<img loading="lazy" src={audioOff} className="home-footer-button" onClick={muteAudio}/>  
                      :<img loading="lazy" src={audioOn} className="home-footer-button" onClick={muteAudio}/>
                    }
                    {viewCamera
                      ?<img loading="lazy" src={cameraOff} className="home-footer-button" onClick={showCamera}/>  
                      :<img loading="lazy" src={cameraOn} className="home-footer-button" onClick={showCamera}/>  
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