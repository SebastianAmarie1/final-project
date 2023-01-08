import React, { useState } from 'react'
import noProfileIcon from "../../Assets/noProfileIcon.png"

function Message({msg, self}) {

    const [toggled, setToggled] = useState(false)

    const time = msg.time_sent.split("T")[1].split(".")[0]
    const status = msg.seen ? "seen" : "sent"

    if(self){
        return(

            <div onClick={() => {setToggled((prev) => !prev)}} key={msg.message_id} className="chat-message-box chat-message-box-own">
                <h5 className="chat-message-box-msg">{msg.message}</h5>
                {toggled &&
                    <div className="chat-message-box-footer">
                        <p>{time}</p>
                        <p className="chat-message-box-footer-seen" >{status}</p>
                    </div>
                }
            </div>
        )
    } else {
        return(
            <div className="chat-container-reciever">
                <img src={noProfileIcon} className="chat-message-image-reciever"></img>
                <div onClick={() => {setToggled((prev) => !prev)}} key={msg.message_id} className="chat-message-box chat-message-box-reciever">
                    <h5 className="chat-message-box-msg">{msg.message}</h5>
                    {toggled &&
                    <div className="chat-message-box-footer footer-white">
                        <p>{time}</p>
                        <p className="chat-message-box-footer-seen" >seen</p>
                    </div>
                }
                </div>
            </div>
        )
    }
}

export default Message