import React from 'react'
import noProfileIcon from "../Assets/noProfileIcon.png"

function Message({msg, self}) {

    if(self){
        return(
            <div key={msg.message_id} className="chat-message-box-own">
                <h5>{msg.message}</h5>
            </div>
        )
    } else {
        return(
            <div className="chat-container-reciever">
                <img src={noProfileIcon} className="chat-message-image-reciever"></img>
                <div key={msg.message_id} className="chat-message-box-reciever">
                    <h5>{msg.message}</h5>
                </div>
            </div>
        )
    }
}

export default Message