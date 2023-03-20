import React, { useState, useEffect, memo, } from 'react'
import { useSocket } from "../../Contexts/socketContext"
import Loader from "../Loader"

function Decision({roomId, nextPhase, currentPhase, endCall, skipCall}) {

    const { socket } = useSocket()

    const [accepted, setAccepted] = useState(false)
    const [response, setReponse] = useState(false)

    /*UseEffect that listens to a socket call called repsonsenextStage*/
    useEffect(() => {
        socket.current.on('responseNextStage', (data) => {
            setReponse(data.response)
        });
    },[])


    /*UseEffect that ensures that both users have agreed before moving on*/
    useEffect(() => {
        if (accepted !== false && response !== false) {
            nextPhase()
            setAccepted(false)
            setReponse(false)
        }
    },[accepted, response])


    /*useEffecr that sends a message to the other user to tell them that they want to progress to the next stage*/
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
                <Loader />
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

                    <div className="home-video-search-footer">
                        <button onClick={skipCall} className="home-video-search-buttons button-small"> Skip</button>
                        <button onClick={endCall} className="home-video-search-buttons button-small end-call"> End Call</button>
                    </div>

                </div>
            </div>
        }
        </>
    )
}

export default memo(Decision)