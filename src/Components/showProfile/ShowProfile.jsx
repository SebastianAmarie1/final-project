import React, {memo} from 'react'
import "./showProfileCss.css"

import defaultPic from "../../Assets/default-user-image.jpg"

function ShowProfile({partnerProfile, endCall, skipCall}) {
  return (
    <div className="showp-container">
      <div className="showp-main">
        <div className="showp-image-container fcc">
          <div className="showp-image-blur"></div>
          <img className="showp-user-picture" src={partnerProfile?.profile_pic ? partnerProfile?.profile_pic : defaultPic}></img>
        </div>
        <div className="showp-user-details">
          <h2>Full Name:</h2>
          <p>{partnerProfile?.fname} {partnerProfile?.lname}</p>
          <h2>Bio:</h2>
          <p>{partnerProfile?.bio ? partnerProfile.bio : 'No Bio'}</p>
          <h2>Location:</h2>
          <p>{partnerProfile?.region}</p>
          <h2>3 Hobbies:</h2>
            <ul>
              <li><span> {partnerProfile?.hobbie1 ? partnerProfile.hobbie1 : 'No Hobbie'} </span></li>
              <li><span> {partnerProfile?.hobbie2 ? partnerProfile.hobbie2 : 'No Hobbie'} </span></li>
              <li><span> {partnerProfile?.hobbie3 ? partnerProfile.hobbie3 : 'No Hobbie'} </span></li>
            </ul>
          <h2>2 Truths 1 Lie:</h2>
            <ul>
              <li><span> {partnerProfile?.fact1 ? partnerProfile.fact1 : 'No Hobbie'} </span></li>
              <li><span> {partnerProfile?.fact2 ? partnerProfile.fact2 : 'No Hobbie'} </span></li>
              <li><span> {partnerProfile?.lie ? partnerProfile.lie : 'No Hobbie'} </span></li>
            </ul>
        </div>
      </div>
      <div className="home-video-search-footer">
          <button onClick={skipCall} className="home-video-search-buttons"> Skip</button>
          <button onClick={endCall} className="home-video-search-buttons end-call"> End Call</button>
      </div>
    </div>
  )
}

export default memo(ShowProfile)