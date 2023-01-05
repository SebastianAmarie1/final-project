import React, { useEffect, useState } from 'react'
import { useAuth } from "../../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import noProfileIcon from "../../Assets/noProfileIcon.png"

function Follow() {

  const { user, axiosAuth } = useAuth()
  const [allUsers, setAllUsers] = useState()
  const navigate = useNavigate()


  const friends = () => {

  }

  return (
    <>
      <div className="navigation-spacer"></div>
      <div className="freinds-main-box">
          {friends}
          <h5 className="friends-main-message">Add more friends</h5>
      </div>
    </>
  )
}

export default Follow