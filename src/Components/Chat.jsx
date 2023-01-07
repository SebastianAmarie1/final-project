import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { nanoid } from 'nanoid'

import { useAuth } from "../Contexts/AuthContext"
import { useSocket } from '../Contexts/socketContext'
import Message from './Message'

function Chat() {

    const { state } = useLocation()
    const { conversationId, recieverId } = state // get the conversation and reciever IDs from the previous page
    const { socket } = useSocket()
    const { user, axiosAuth } = useAuth()

    const [inputMessage, setInputMessage] = useState("")
    const [messages, setMessages] = useState()
    const [arrivalMessage, setArrivalMessage] = useState(null)

    useEffect(() => { 
        socket.current.on("messageRecieved", (data) => {
            console.log("message recieved")
            setArrivalMessage({
                recieverid: data.recieverId,
                message: data.message,
                senderid: data.senderId,
                message_id: nanoid()
            })
        })
    }, [])

    useEffect(() => { //adds the arrived message to the messages
        arrivalMessage && JSON.stringify(arrivalMessage.senderid) === recieverId &&
        setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => { //retrieve the messages from the DB
        const getMessages = async() => {
            try {
                const res = await axiosAuth.post("/api/retrieve_messages", { conversation_id: conversationId },
                { headers: 
                    { authorization: "Bearer " + user.accessToken}
                })//sends a request to the server
                setMessages(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMessages()
    },[user.id])

  const handleSendMessage = async(e) => { //runs when you send a message
    e.preventDefault()

    setMessages((prev) => [...prev, {senderid: JSON.stringify(user.id), recieverid: JSON.stringify(recieverId), message: inputMessage, message_id: nanoid()}])

    let userActivity

    try { // sends messages to the Database
        const res = await axiosAuth.post("/api/create_message", { conversation_id: conversationId, senderId: user.id, recieverId: recieverId, message: inputMessage },
            { headers: 
                { authorization: "Bearer " + user.accessToken}
            })
        userActivity = res.data.active
    } catch (error) {
        console.log(error)
    }
    
    if ( userActivity ){
        socket.current.emit("sendMessage", { // sends message to the socket
            senderId: user.id,
            recieverId: recieverId,
            message: inputMessage
        })
    }

    setInputMessage("")
  }

  const practise = () => {
    socket.current.emit("printUsers", {  
    })
  }

  return (
    <div className="chat-container">
        <div className="chat-container-messages">
            {messages?.map((current) => {
                return(
                    <Message key={current.message_id} msg={current} self={current.senderid === JSON.stringify(user.id)}/>
                )
            }
            )}
        </div>
        <div className="chat-footer">
            <textarea className="chat-footer-textarea"
                type="text"
                id="message"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)} 
                placeholder="Message... " />
            <button className="chat-footer-button" onClick={(e) => handleSendMessage(e)}>&gt;</button><button onClick={practise}>SeeUserHash</button>
        </div>
    </div>
  )
}

export default React.memo(Chat)