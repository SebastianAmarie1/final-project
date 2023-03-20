import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import "./landingpage.css"
import "./landingPageAnimations.css"

import InformationImage from "../../Assets/LandingPage/landing-page-gif.gif"
import SignIn from "../../Assets/LandingPage/signin-img.png"
import Profile from "../../Assets/LandingPage/profile-img.png"
import Video from "../../Assets/LandingPage/videocall-img.png"
import Chat from "../../Assets/LandingPage/chat-img.png"

function LandingPage() {

  const [div, setDiv] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [totalHeight, setTotalHeight] = useState()


  /* y pos tracker*/ 
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };


  /*Function to update the total height variable*/
  function updateSize() {
    setTotalHeight(window.document.body.offsetHeight - window.innerHeight);
  }
  
  
  /*UseEffect that activates the animation*/
  useEffect(() => {
    setTimeout(() => {
      setDiv(true)
    }, 4000)

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [])


  /*UseEffect that listens for scrolling or screen size changes*/
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalHeight]);


  return (
    <>
    <div className={`landing-loading-main landing-loading-animation ${div && `hide`}`}>
      <div className="landing-loading-top">
        <div className="landing-top-container">
            <h1 className="landing-top-title landing-clr-primary landing-loading-title-animation">Meeting The Right Person With WhizzEros</h1>
            <h4 className='landing-top-decription landing-clr-primary landing-loading-desc-animation'>Are you tired of normal dating applications? have some fun with WhizzEros's 
            3-step video call function. Sign up now for FREE.</h4>
            <div className="landing-top-button-container">
              <Link to="/signup"><button className="lButton landing-loading-desc-animation"><span>Sign Up</span></button></Link>
              <Link to="/signin"><button className="lButton landing-loading-desc-animation"><span>Sign In</span></button></Link>
              </div>
          </div>
        </div>
      </div>
    <div className="landing-main">
      <div className="landing-top">

        <div className="heart heart-1" style={{'--index': 0}}></div>
        <div className="heart heart-2" style={{'--index': 1}}></div>
        <div className="heart heart-3" style={{'--index': 2}}></div>
        <div className="heart heart-4" style={{'--index': 3}}></div>
        <div className="heart heart-5" style={{'--index': 4}}></div>
        <div className="heart heart-6" style={{'--index': 5}}></div>
        
        
        <div className="landing-top-container">
          <h1 className="landing-top-title landing-loading-title-animation">Meeting The Right Person With WhizzEros</h1>
          <h4 className='landing-top-decription landing-loading-desc-animation'>Are you tired of normal dating applications? have some fun with WhizzEros's 
          3-step video call function. Sign up now for FREE.</h4>
          <div className="landing-top-button-container">
            <Link to="/signup"><button className="lButton"><span>Sign Up</span></button></Link>
            <Link to="/signin"><button className="lButton"><span>Sign In</span></button></Link>
            <div className="landing-top-download-icons">
              <a href="#about" className="landing-top-arrow-container">
                <div className="landing-top-arrow-blur"></div>
                <div className="landing-top-arrow-center"></div>
                <div className="landing-top-arrow-left"></div>
                <div className="landing-top-arrow-right"></div>
              </a>
            </div>
          </div>
        </div>
      </div>

      { /*Information*/ }

      <div className="landing-info" id="about">
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
        

      </div>
    </div>
    </>
  )
}

export default LandingPage