import React from 'react'
import { Link } from "react-router-dom"
import noProfileIcon from "../Assets/noProfileIcon.png"

function ChatNavigation() {
  return (
    <div className="cnav-container">
        <div className="cnav-container-left">
            <Link to="/homepage/follow"><h1 className="cnav-container-arrow">&lt;</h1></Link>
            <img src={noProfileIcon} className="cnav-container-pp"></img>
            <h4 className="cnav-container-username">Username</h4>
        </div>
    </div>
  )
}

export default ChatNavigation