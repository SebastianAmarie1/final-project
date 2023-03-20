import React, { useEffect, useState, useRef, lazy } from 'react'
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

  /* Variables from useContexts*/
  const { user, axiosAuth, connectionRef, setRoomId, roomId } = useAuth()
  const { socket } = useSocket()
  const [width, setWidth] = useState(window.innerWidth);

  /*Connections use States*/
  const [stream, setStream] = useState() 
  const [pStream, setPStream] = useState(null)
  const [searching, setSearching] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [partnerId, setPartnerId] = useState(null)
  const [partnerProfile, setPartnerProfile] = useState(null)
  const [initiator, setInitiator] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(null)
  const [callerSignal, setCallerSignal] = useState(null)

  /*Camera Settings usestates*/
  const [mute, setMute] = useState(false)
  const [partnerMute, setPartnerMute] = useState(false)
  const [viewCamera, setViewCamera] = useState(false)
  const [viewPartnerCamera, setPartnerViewCamera] = useState(false)//you switch off partners camera
  const [partnerCamera, setPartnerCamera] = useState(true)//partner switches off their camera

  /*Streams and Videos usestates*/
  const myVideo = useRef(null)
  const [myVideoToggled, setMyVideoToggled] = useState(false)
  const partnerVideo = useRef()
  const [partnerVideoToggled, setPartnerVideoToggled] = useState(false)
  const [showHO, setShowHO] = useState(false)

  /*Phases usestates*/
  const [currentPhase, setCurrentPhase] = useState(1)// out of 3
  const phaseTime = [0, 0.5, 0.5, 0.5]
  const [showTimer, setShowTimer] = useState(false)
  const [decisionScreen, setDecisionScreen] = useState(false)
  const [transitionFlag, setTransitionFlag] = useState(false)

  /*Phase 3 usestates*/
  const [question, setQuestion] = useState(null)


  /*Use Effect sets up the homepage and has socket listeners*/
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

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])


  /*Get a users details if there is a person on call*/
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


/*Search for a room function*/
  const searchForCall = () => {
    setSearching(true)

    socket.current.emit("search", {  
      id: user.id,
      gender: user.gender,
    })
  }


  /*Use Effect that initiates a call to another user*/
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


/*Use State that recies the call*/
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

  
  /*UseEffect that decides when to display decision screen*/
  useEffect(() => {
    if(partnerVideo.current){
      partnerVideo.current.srcObject = pStream
      partnerVideo.current.play()
    }
  },[decisionScreen])


  /*Function that stops the search for another user*/
  const stopSearch = () => {
    setSearching(false)
    setRoomId(null)

    socket.current.emit("leaveRoom", {  
      roomId: roomId,
    })
  }

  /*End Call function*/
  const endCall = async() => {
    if (connectionRef.current) {
      socket.current.emit("endCall", {
        roomId: roomId,
      });

      connectionRef.current.on('close', () => {});
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


  /*Function to skil a call*/
  const skipCall = async () => {
    endCall()
    searchForCall()
  }


/* Camera Settings functions*/
  /*Function to mute Audio*/
  const muteAudio = () => {
    if (myVideo.current) {
      setMute((prev) => !prev)
      const stream = myVideo.current.srcObject;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  }


  /*Function to mute the partner audio*/
  const mutePartnerAudio = () => {
    if (partnerVideo.current) {
      setPartnerMute((prev) => !prev)
      partnerVideo.current.volume = partnerMute ? 1 : 0;
    }
  }
  

  /*Function to show your camera after hiding it*/
  const showCamera = async() => {
    setViewCamera((prev) => !prev)
    viewCamera ? myVideo.current.play() : myVideo.current.pause()

    socket.current.emit("editVideo", {
      active: viewCamera,
      roomId: roomId,
    })
  }


  /*Function to show partner camera after hiding it*/
  const showPartnerCamera = () => {
    setPartnerViewCamera((prev) => !prev)
    viewPartnerCamera ? partnerVideo.current.play() : partnerVideo.current.pause()
  }


/* Phases Functions*/
  /*Functions that handles the counter when it finishes*/
  const handleCountdownEnd = () => {
    setShowTimer(false)
    setDecisionScreen(true)
  }


  /*Function that handles switching to the next phase*/
  const nextPhase = () => {
    if (currentPhase <= 3){
      setCurrentPhase((old) => old + 1)
      setShowTimer(true)
      setDecisionScreen(false)
    }
  }


/*Phase 3 Code*/
  /*Function to get questions from RAPID API*/
  const getQuestion = async() => {
    const options = {
        method: 'GET',
        url: process.env.REACT_APP_RAPIDAPIURL,
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPIKEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPIHOST
        }
      };
      
      const res = await axios.request(options)
      setQuestion(res.data[0].question)
  }  


  /*That makes a delay for the animation of the questions*/
  const settingFlag = () => {
    setTransitionFlag(true)
    setTimeout(() => {
      setTransitionFlag(false)
    },3000)
  }


  /*UseEffect that gets the 4 different questions for phase 3*/
  useEffect(() => { 
    if (currentPhase === 3){
      settingFlag()
      if (connectionRef.current){
        getQuestion()
      }

      setTimeout(() => {
        if (connectionRef.current){
          settingFlag()
          setTimeout(() => {
            getQuestion()
          },3000)
        }
      },30000)

      setTimeout(() => {
        if (connectionRef.current){
          settingFlag()
          setTimeout(() => {
            getQuestion()
          },3000)
        }
      },60000)
      
      setTimeout(() => {
        if (connectionRef.current){
          settingFlag()
          setTimeout(() => {
            getQuestion()
          },3000)
        }
      },90000)
    } 
  },[currentPhase]) 


  /*Function to handle wether hints and online should show or not*/
  const handleShow = () => {
    setShowHO((prev) => !prev)
  }


  /* Code that decides wether it should show the hints/online component*/
  const showHOHml = <div onClick={(e) => {
    e.stopPropagation() 
    handleShow()
    }} className="home-partner-show-ho">
    {showHO
      ? callerSignal
        ? <>
          X
          <Hints />
          </>
        :
          <>
          X
          <Online onlineUsers={onlineUsers} />
          </>
      : <p>Show</p>
    }
  </div>


  /*HTML for Videos are stored in a variable*/
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
                    {showHOHml}
                  </div>
                  :
                  <div className="home-video-search" onClick={searchForCall}>
                    <div className="home-video-search-static"/>
                    <h3 className="home-video-search-text">Click To Find Partner</h3>
                    <div className="home-video-search-static home-video-search-static-secondary"/>
                    {showHOHml}
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
                            </div>
                        }

                        {PartnersVideo}

                        {question && <div className={`question-container ${transitionFlag ? "question-animation" : "question-return"}`}>
                          <p>
                            {question}
                          </p>
                          </div>}

                        {showHOHml}
                        
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
          {(width < 1200)
            ?<></>
            : callerSignal
              ? 
                <Hints />
              :
                <Online onlineUsers={onlineUsers} />
          }
          <div className="home-video-user fcc">
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