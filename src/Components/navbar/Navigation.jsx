import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../Contexts/AuthContext"
import friendsIcon from "../../Assets/friendsIcon.png"
import { useSocket } from "../../Contexts/socketContext"

import "./NavigationStyle.css"

function Navigation() {

  const { user, setUser, axiosAuth, connectionRef, roomId } = useAuth()
  const { socket } = useSocket()
  const [toggled, setToggled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== "/homepage/" || location.pathname !=="/homepage"){
      if (connectionRef.current && roomId) {
        socket.current.emit("endCall", {
          roomId: roomId,
        });
      }
    }
  },[location.pathname])

  useEffect(()=> {
    if (user !== "a" && user !== null) {
        socket.current.on('connect', () => {})
        socket.current.emit("addUser", {  
          userId : user.id,
          name : user.username,
        })
    }
  },[user])

  function eventHandler() {
    setToggled((oldValue) => !oldValue)
  }

  const handleLogout = async() => { //removes the user from local storage and state

    await axiosAuth.post("/api/logout", {id: user.id}, {
      headers: { authorization: "Bearer " + user.accessToken}
    })
    localStorage.removeItem('userDetails')

    socket.current.emit("rmvUser", {userId : user.id})
   
    setUser(null)
    navigate("/signin")
  }
  
  return (
    <>
    <nav className="navigation-container">
        <Link to="/"><h2 className="navigation-logo">Whizz</h2></Link>

        <div className="navigation-right-container">
          { user 
          ? <><Link to="/homepage/follow"><img loading="lazy" src={friendsIcon} className="navigation-friends-icon"></img></Link>
              <h4 onClick={handleLogout} className="navigation-btn">Sign Out</h4></>
          : <Link to="/signin"> <h4 className='navigation-btn'>Sign In</h4></Link>}
          <div onClick={eventHandler} className="navigation-burger">
            <div className={`navigation-burger-ind ${toggled ? 'burger-top-toggled' : 'burger-top'}`}></div>
            <div className={`navigation-burger-ind ${toggled ? 'burger-middle-toggled' : 'burger-middle'}`}></div>
            <div className={`navigation-burger-ind ${toggled ? 'burger-bottom-toggled' : 'burger-bottom '}`}></div>
          </div>
        </div>

        <div className={`navigation-bottom ${toggled ? `navigation-bottom-active` : `navigation-bottom-deactive`}`}>
            {user 
            ?
              <>
                <div className="navigation-bottom-individual fcc">
                  <Link onClick={eventHandler} to="/homepage"> <h4 className='navigation-bottom-active-option'>Home</h4></Link>
                </div>
                <div className="navigation-bottom-individual fcc">
                  <Link onClick={eventHandler} to="/homepage/follow"> <h4 className='navigation-bottom-active-option'>Friends</h4></Link>
                </div>
                <div className="navigation-bottom-individual fcc">
                  <Link onClick={eventHandler} to="/homepage/profile"> <h4 className='navigation-bottom-active-option'>Profile</h4></Link> 
                </div>
                <div className="navigation-bottom-individual fcc">
                  <Link onClick={eventHandler} to="/homepage"> <h4 className='navigation-bottom-active-option'>Contact Us</h4></Link>
                </div>
              </>
            :
              <>
                <div className="navigation-bottom-individual fcc">
                  <Link onClick={eventHandler} to="/"> <h4 className='navigation-bottom-active-option'>Home</h4></Link>
                </div>
                <div className="navigation-bottom-individual fcc">
                  <Link onClick={eventHandler} to="/homepage"> <h4 className='navigation-bottom-active-option'>Contact Us</h4></Link>
                </div>
                <div className="navigation-bottom-individual fcc">
                  <Link onClick={eventHandler} to="/homepage"> <h4 className='navigation-bottom-active-option'>About Us</h4></Link>
                </div>
              </>
            }
        </div>
    </nav>
    <div className="navbar-spacer"></div>
    </>
  )
}

export default Navigation