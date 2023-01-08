import React, { useEffect, useState, useRef, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useNavigate } from "react-router-dom"


import { useAuth } from "../../Contexts/AuthContext"
import { useSocket } from '../../Contexts/socketContext'
import Message from './Message'
import "./ChatCss.css"

function Chat() {

    const { state } = useLocation()
    const navigate = useNavigate()
    const { conversationId, recieverId, cname } = state // get the conversation and reciever IDs from the previous page
    const { socket } = useSocket()
    const { user, axiosAuth } = useAuth()

    const [inputMessage, setInputMessage] = useState("")
    const [messages, setMessages] = useState()
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const messageEndRef = useRef(null)

    let compareDate = null
    let previousMsgOwner = null

    useEffect(() => { 
        socket.current.on("messageRecieved", (data) => {
            console.log("message recieved")
            setArrivalMessage({
                recieverid: data.recieverId,
                message: data.message,
                senderid: data.senderId,
                message_id: nanoid(),
                time_sent: data.time_sent,
            })
        })
    }, [])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    },[messages])

    useEffect(() => { //adds the arrived message to the messages
        arrivalMessage && JSON.stringify(arrivalMessage.senderid) === recieverId &&
        setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => { //retrieve the messages from the DB
        const getMessages = async() => {
            try {
                const res = await axiosAuth.post("/api/retrieve_messages", { 
                    conversation_id: conversationId,
                    senderId: recieverId,
                },
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

    const time_sent = new Date().toISOString()

    setMessages((prev) => [...prev, {senderid: JSON.stringify(user.id), recieverid: JSON.stringify(recieverId), message: inputMessage, message_id: nanoid(), time_sent: time_sent}])

    let userActivity

    try { // sends messages to the Database
        const res = await axiosAuth.post("/api/create_message", { conversation_id: conversationId, senderId: user.id, recieverId: recieverId, message: inputMessage, time_sent: time_sent },
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
            message: inputMessage,
            time_sent: time_sent,
        })
    }

    setInputMessage("")
  }

  return (
    <div className="chat-main">
        <div className="chat-container">
            <div className="chat-header fcc">
                <h3 className="chat-header-title">{cname}</h3>
                <h1 onClick={() => {navigate(`/homepage/follow/`)}} className="chat-header-back">&gt;</h1>
            </div>
            <div className="chat-container-messages">
                {messages?.map((current) => {
                    let flag = false
                    let dpic = false

                    let date = current.time_sent.split("T")[0]

                    if (date != compareDate){
                        flag = true
                        compareDate = date
                    }
                    if (previousMsgOwner != current.senderid){
                        dpic = true
                        previousMsgOwner = current.senderid
                    }

                    return(
                        <Fragment key={current.message_id}>
                            {flag &&
                                <div className="message-date-seperator fcc">
                                    <div className="message-date-seperator-line"></div>
                                    <p>{date}</p>
                                    <div className="message-date-seperator-line"></div>
                                </div>
                            }  
                            <Message msg={current} dpic={dpic} self={current.senderid === JSON.stringify(user.id)}/>
                            <div ref={messageEndRef}/>
                        </Fragment>
                    )
                }
                )}
            </div>
            <div className="chat-footer">
                <textarea className="chat-footer-textarea"
                    type="text"
                    id="message"
                    value={inputMessage}
                    maxLength="255"
                    onChange={e => setInputMessage(e.target.value)} 
                    placeholder="Message... " />
                <button className="chat-footer-button" onClick={(e) => handleSendMessage(e)}>&gt;</button>
            </div>
        </div>
    </div>
  )
}

export default React.memo(Chat)