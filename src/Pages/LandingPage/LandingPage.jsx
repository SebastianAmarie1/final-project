import React, {useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom';
import "./landingpage.css"
import "./landingPageAnimations.css"
import { reviews } from "./reviews.jsx"

import InformationImage from "../../Assets/LandingPage/landing-page-gif.gif"
import GooglePlay from "../../Assets/LandingPage/googlePlayIcon.png"
import AppleStore from "../../Assets/LandingPage/appleDownloadIcon.png"
import SignIn from "../../Assets/LandingPage/signin-img.png"
import Profile from "../../Assets/LandingPage/profile-img.png"
import Video from "../../Assets/LandingPage/videocall-img.png"
import Chat from "../../Assets/LandingPage/chat-img.png"
import SpeachMarks from "../../Assets/LandingPage/speachmarks.png"

import Noprofile from "../../Assets/noProfileIcon.png"

function LandingPage() {

  const [div, setDiv] = useState(false)

  const [scrollPosition, setScrollPosition] = useState(0)
  const [totalHeight, setTotalHeight] = useState()


  const [shuffle, setShuffle] = useState(false)
  const [indexes, setIndexes] = useState([])


  // Card Shuffling
  useEffect(() => {
    getRandomIndexes()
  },[])
  
  const getRandomIndexes = () => {
    //gets 4 random indexes which are not the same for each card.
    const indexes = []
    
    while (indexes.length <= 3) {
      const num = Math.floor(Math.random() * (7 - 0 + 1) + 0)//change this to match API length
      if (!(indexes.includes(num))){
        indexes.push(num)
      }
    } 
    setIndexes(indexes)
  }
  
  const handleShuffle = () => {
    //allows animations to happen and sets timeouts
    setShuffle(true)
    setTimeout(() => {
      getRandomIndexes()
      setShuffle(false)
    }, 1500)
  }

  // y pos 
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  function updateSize() {
    setTotalHeight(window.document.body.offsetHeight - window.innerHeight);
  }
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [totalHeight]);

  useEffect(() => {
    setTimeout(() => {
      setDiv(true)
    }, 4000)

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [])

  useEffect(() => {
    console.log(scrollPosition)
  },[scrollPosition])

  return (
    <>
    <div className={`landing-loading-main landing-loading-animation ${div && `hide`}`}>
      <div className="landing-loading-top">
        <div className="landing-top-container">
            <h1 className="landing-top-title landing-clr-primary landing-loading-title-animation">Meeting The Right Person With WhizzEros</h1>
            <h4 className='landing-top-decription landing-clr-primary landing-loading-desc-animation'>Are you tired of normal dating applications? have some fun with WhizzEros's 
            3-step video call function. Sign up now for FREE.</h4>
            <div className="landing-top-button-container">
              <button className="landing-top-button landing-bg-primary landing-loading-desc-animation"><Link className="landing-top-link landing-clr-highlighted" to="/signup">Sign Up</Link></button>
              <button className="landing-top-button landing-bg-primary landing-loading-desc-animation"><Link className="landing-top-link landing-clr-highlighted" to="/signin">Sign In</Link></button>
            </div>
          </div>
        </div>
      </div>
    <div className="landing-main">
      <div className="landing-top">
        <div className="landing-top-container">
          <h1 className="landing-top-title landing-loading-title-animation">Meeting The Right Person With WhizzEros</h1>
          <h4 className='landing-top-decription landing-loading-desc-animation'>Are you tired of normal dating applications? have some fun with WhizzEros's 
          3-step video call function. Sign up now for FREE.</h4>
          <div className="landing-top-button-container">
            <button className="landing-top-button landing-loading-btn-animation"><Link className="landing-top-link" to="/signup">Sign Up</Link></button>
            <button className="landing-top-button landing-loading-btn-animation"><Link className="landing-top-link" to="/signin">Sign In</Link></button>
            <div className="landing-top-download-icons">
              <img className="landing-top-download-pics" src={GooglePlay}></img>
              <img className="landing-top-download-pics" src={AppleStore}></img>
            </div>
          </div>
        </div>
      </div>

      { /*Information*/ }

      <div className="landing-info">
        <div className="landing-info-ww">
          <div className="landing-info-ww-container">
            <div className="landgng-info-ww-info">
              <h1 className="landing-info-ww-title">What Is WhizzEros?</h1>
              <h5 className="landing-info-ww-text">
              WhizzEros is a modern dating tool with user-friendly interface and 
              intuitive functionality. It connects users for five-minute conversations
              to quickly evaluate compatibility and decide to continue or move on. 
              After five minutes, users can add the person to their contact list for
                potential future interactions.
              </h5>
            </div>
            <img className="landing-info-ww-img" src={InformationImage}></img>
          </div>
        </div>

      {/* Workings */}

        <div className="landing-info-works-container">
          <div className="landing-info-works-title">
            <h1 className="landing-info-ww-title">How WhizzEros Works</h1>
          </div>

          <div className="landing-info-works-steps-box">
            <div className="landing-info-works-individual">
              <div className="landing-info-works-indv">
                <div className="landing-info-works-indv-left">
                  <div className={`landing-info-works-indv-step ${scrollPosition > 1150 && 'landing-info-works-indv-step-animation'}`}>1</div>
                  <h2>Login</h2>
                  <p>To access features and benefits of our platform, first create an 
                    account by navigating to the landing page and locate the 
                    "Sign Up" button. Carefully and accurately enter all required 
                    information during the account creation process to avoid delays 
                    or complications.
                  </p>
                </div>
                <div className="landing-info-works-indv-right fcc">
                  <img className={`landing-info-works-indv-img ${scrollPosition > 1150 && 'landing-info-works-indv-img-animation'}`} src={SignIn}></img>
                </div>
              </div>
            </div>

            <div className="landing-info-works-individual ">
              <div className="landing-info-works-indv landing-reversed">
                <div className="landing-info-works-indv-left">
                  <div className={`landing-info-works-indv-step ${scrollPosition > 1900 && 'landing-info-works-indv-step-animation'}`}>2</div>
                  <h2>Profile</h2>
                  <p>Upon successful login, you will be granted access to the full 
                  spectrum of features and services available on our platform. 
                  However, we strongly recommend that you take a moment to visit 
                  your profile and create a comprehensive profile for others to view,
                  so others can learn more about you and connect with you in a
                  meaningful way.
                  </p>
                </div>
                <div className="landing-info-works-indv-right fcc">
                  <img className={`landing-info-works-indv-img ${scrollPosition > 1900 && 'landing-info-works-indv-img-animation'}`} src={Profile}></img>
                </div>
              </div>
            </div>

            <div className="landing-info-works-individual">
              <div className="landing-info-works-indv">
                <div className="landing-info-works-indv-left">
                  <div className={`landing-info-works-indv-step ${scrollPosition > 2600 && 'landing-info-works-indv-step-animation'}`}>3</div>
                  <h2>Video Call</h2>
                  <p>You can now fully immerse yourself in the main features of our application
                    that is centered around connecting with other users through a simple and 
                    easy-to-use process of three steps to establish connections with like-minded
                    individuals. The first step is to initiate a connection with a random user 
                    by clicking on the "Connect" button located within the user's profile, after 
                    that you can engage in conversation with the other user and learn more about 
                    their interests, background, and goals.
                  </p>
                </div>
                <div className="landing-info-works-indv-right fcc">
                  <img className={`landing-info-works-indv-img ${scrollPosition > 2600 && 'landing-info-works-indv-img-animation'}`} src={Video}></img>
                </div>
              </div>
            </div>

            <div className="landing-info-works-individual landing-info-works-individual-dark">
              <div className="landing-info-works-indv landing-reversed">
                <div className="landing-info-works-indv-left">
                  <div className={`landing-info-works-indv-step ${scrollPosition > 3400 && 'landing-info-works-indv-step-animation'}`}>4</div>
                  <h2>Chat</h2>
                  <p>After completing a video call, you can take your connection to the next level 
                  by arranging real-life activities with the other user using our direct messaging
                    feature that allows you to easily and efficiently communicate, plan activities,
                    and even share information such as location and contact details.
                  </p>
                </div>
                <div className="landing-info-works-indv-right fcc">
                  <img className={`landing-info-works-indv-img ${scrollPosition > 3400 && 'landing-info-works-indv-img-animation'}`} src={Chat}></img>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* REVIEWS */}
        <div className="card-main-container">
          <h1 className="landing-info-ww-title">WhizzEros Reviews</h1>
          <section className={`card-section ${shuffle ? "" : "activate-shuffle"}`}>
              {
                indexes.map((index, i) => {
                  return(
                    <div key={i} className={`big-card ${shuffle ? "shuffle" : "move"}`}>
                      <div className="big-card-title">
                        <img className="big-card-title-speachmarks" src={SpeachMarks}></img>
                        <div className="big-card-title-container">
                          <h3 className="big-card-title-rating">4.7</h3>
                        </div>
                      </div>
                      <div className="big-card-body">
                        <h1>Title</h1>
                        <p>{reviews[index].message}</p>
                      </div>
                      <div className="big-card-footer">
                        <img className="big-card-pfp" src={Noprofile}></img>
                        <div className="big-card-title-footer">
                          <h1 >{reviews[index].username}</h1>
                          <p>{reviews[index].footer}</p>
                        </div>
                        <img className="big-card-title-speachmarks footer-speachmarks" src={SpeachMarks}></img>
                      </div>
                    </div>
                  ) 
                })
            }
            <div className="placeholder"></div>
            <div className="placeholder2"></div>
          </section>
            <button onClick={handleShuffle} className="card-button">Shuffle</button>
        </div>

      </div>
    </div>
    </>
  )
}

export default LandingPage