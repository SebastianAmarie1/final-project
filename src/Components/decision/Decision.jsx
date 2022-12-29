import React, { useState, useEffect } from 'react'
import { useSocket } from "../../Contexts/socketContext"


function Decision({roomId, nextPhase}) {

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
                <div className="search-outer-circle fcc outer-circle-animation"></div>
                <div className="search-middle-circle fcc middle-circle-animation"></div>
                <div className="search-inner-circle fcc inner-circle-animation"></div>
                <h3 className="home-video-search-text">Waiting On Parter Response</h3>
            </div>
            :
            <div className="home-video-search" onClick={acceptNextPhase}>
                <div className="search-outer-circle fcc">
                    <div className="search-middle-circle fcc">
                        <div className="search-inner-circle fcc" >
                            <h3 className="home-video-search-text">Next Phase: 2</h3>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default Decision