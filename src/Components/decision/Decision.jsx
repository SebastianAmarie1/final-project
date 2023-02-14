import React, { useState, useEffect } from 'react'
import { useSocket } from "../../Contexts/socketContext"


function Decision({roomId, nextPhase, currentPhase, endCall, skipCall}) {

    const { socket } = useSocket()

    const [accepted, setAccepted] = useState(false)
    const [response, setReponse] = useState(false)

    useEffect(() => {
        socket.current.on('responseNextStage', (data) => {
            setReponse(data.response)
        });
    },[])

    useEffect(() => {
        if (accepted !== false && response !== false) {
            nextPhase()
            setAccepted(false)
            setReponse(false)
        }
    },[accepted, response])

    const acceptNextPhase = () => {
        setAccepted((old) => !old)

        socket.current.emit("responseNextStage", {  
            roomId: roomId,
            response: true,
          })
    }

    return (
        <>
        {accepted 
            ?
            <div className="home-video-search">
                <div className="loader home-video-loader">
                    <div className="face">
                        <div className="circle"></div>
                    </div>
                    <div className="face">
                        <div className="circle"></div>
                    </div>
                </div>
                <h3 className="home-video-search-text">Waiting For Partner Response</h3>

                <div className="home-video-search-footer fcc">
                    <button className="home-video-search-buttons"> Skip</button>
                    <button onClick={endCall} className="home-video-search-buttons end-call"> End Call</button>
                </div>
            </div>
            :
            <div className="home-video-search" >
                <div className="home-video-search-container">
                    <h1>Click If You Would You Like To Go Onto The Next Stage?</h1>
                    <div className="home-video-search-phase fcc" onClick={acceptNextPhase}>
                        <div className="home-video-search-static"/>
                        <h3 className="home-video-search-text">Next Phase: {currentPhase + 1}</h3>
                        <div className="home-video-search-static home-video-search-static-secondary"/>
                    </div>

                    <div className="home-video-search-footer fcc">
                        <button onClick={skipCall} className="home-video-search-buttons"> Skip</button>
                        <button onClick={endCall} className="home-video-search-buttons end-call"> End Call</button>
                    </div>

                </div>
            </div>
        }
        </>
    )
}

export default Decision