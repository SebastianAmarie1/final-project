import React from 'react'
import "./showProfileCss.css"

import defaultPic from "../../Assets/default-user-image.jpg"

function ShowProfile() {
  return (
    <div className="showp-container">
      <img className="showp-user-picture" src={defaultPic}></img>
      <h2>Name</h2>
      <p>User description</p>
      <h3>Location</h3>
      <h3>3 Hobbies</h3>
      <h3>3 Intresting Fact</h3>
    </div>
  )
}

export default ShowProfile