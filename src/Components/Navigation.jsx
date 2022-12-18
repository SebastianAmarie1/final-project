import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from "../Contexts/AuthContext"
import axios from "../Contexts/axiosConfig"
import { useNavigate } from 'react-router-dom';
import friendsIcon from "../Assets/friendsIcon.png"
import { useSocket } from "../Contexts/socketContext"

function Navigation() {

  const { user, setUser, axiosAuth, flag } = useAuth()
  const { socket } = useSocket()
  const [toggled, setToggled] = useState(false)
  const navigate = useNavigate()

  useEffect(()=> {
    if (user !== "a" && user !== null) {
        socket.current.on('connect', () => {})
        socket.current.emit("addUser", {  
          userId : user.id,
          name : user.username,
        })
    }
  },[user])

  function eventHandler(flag) {
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
    <nav className="navigation-container">
        <Link to="/"><h2 className="navigation-logo">WhizzEros</h2></Link>

        <div className="navigation-right-container">
          { user 
          ? <><Link to="/homepage/follow"><img src={friendsIcon} className="navigation-friends-icon"></img></Link>
              <h4 onClick={handleLogout} className="navigation-btn">Sign Out</h4></>
          : <Link to="/signin"> <h4 className='navigation-btn'>Sign In</h4></Link>}
          
          <div onClick={eventHandler} className="navigation-burger">
            <div className="navigation-burger-ind"></div>
            <div className="navigation-burger-ind"></div>
            <div className="navigation-burger-ind"></div>
          </div>
        </div>

        <div className={`navigation-bottom-active ${toggled ? `show` : `hide`}`}>
          <div className="navigation-bottom-active-spacer"></div>
          <div className="navigation-bottom-active-container">
            {user &&<>
              <Link onClick={eventHandler} to="/homepage/profile"> <h4 className='navigation-bottom-active-option'>Profile</h4></Link> 
            </>}
            <Link onClick={eventHandler} to="/homepage"> <h4 className='navigation-bottom-active-option'>Home</h4></Link>
            <Link onClick={eventHandler} to="/homepage"> <h4 className='navigation-bottom-active-option'>Contact Us</h4></Link>
            <Link onClick={eventHandler} to="/homepage"> <h4 className='navigation-bottom-active-option'>About Us</h4></Link>
          </div>
        </div>
    </nav>
  )
}

export default Navigation