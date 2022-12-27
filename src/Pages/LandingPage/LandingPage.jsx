import React, {useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom';
import "./landingpage.css"
import "./landingPageAnimations.css"
import { reviews } from "./reviews.jsx"

import InformationImage from "../../Assets/LandingPage/landingPage-ww.jpg"
import GooglePlay from "../../Assets/LandingPage/googlePlayIcon.png"
import AppleStore from "../../Assets/LandingPage/appleDownloadIcon.png"


function LandingPage() {

  const [div, setDiv] = useState(false)

  const [scrollPosition, setScrollPosition] = useState(0)
  const [totalHeight, setTotalHeight] = useState()
  const [scrollPosPercentage, setScrollPosPercentage] = useState(0)
  const [peachDraw, setPeachDraw] = useState(0)
  const [purpleDraw, setPurpleDraw] = useState(0)
  const peachPath = useRef()
  const purplePath = useRef()

  const [shuffle, setShuffle] = useState(false)
  const [indexes, setIndexes] = useState([])

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
  
  let peachPathLength = peachPath.current?.getTotalLength()
  let purplePathLength = purplePath.current?.getTotalLength()
 
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  function updateSize() {
    setTotalHeight(window.document.body.offsetHeight - window.innerHeight);
  }
  
  useEffect(() => {
    setScrollPosPercentage((scrollPosition/totalHeight) * 100)
    
    setPeachDraw(peachPathLength * scrollPosPercentage)
    setPurpleDraw((peachPathLength * 0.825) * scrollPosPercentage)

    if(peachPath.current){
      peachPath.current.style.strokeDashoffset = peachPathLength - (peachDraw) /50
    }
    if(purplePath.current){
      purplePath.current.style.strokeDashoffset = purplePathLength - (purpleDraw) / 50
    }

  }, [scrollPosition])


  useEffect(() => {
    if(peachPath.current){
      peachPath.current.style.strokeDasharray = peachPathLength 
      peachPath.current.style.strokeDashoffset = peachPathLength

      purplePath.current.style.strokeDasharray = purplePathLength 
      purplePath.current.style.strokeDashoffset = purplePathLength
    }
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
              <h5 >Add GooglePlay / Apple Store </h5>
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

      { /*Infrotmation*/ }

      <div className="landing-info">
        <div className="landing-info-ww">
          <h1 className="landing-info-ww-title grid-t">What Is WhizzEros?</h1>
          <div className="landing-info-ww-left grid-s">
            <img className="landing-info-ww-img" src={InformationImage}></img>
            
          </div>
          <div className="landing-info-ww-right grid-i">
            <h5 className="landing-info-ww-text">
                WhizzEros is a new dating tool which can be used by anyone with an
                account. The purpose behind WhizzEros is to connect people in a more
                visual manner. The concept behind the app is that you are mathced with
                a random person and you will then have a one minuite conversation with
                them. after the one minuite you will then decide wether you would like
                to continue for another minuite or leave. after 3 minuites of talking
                you will then get an option to add the person.
              </h5>
          </div>
        </div>

      {/* REVIEWS */}
      <div className="card-main-container">
        <section className={`card-section ${shuffle ? "" : "activate-shuffle"}`}>
            {
              indexes.map((index, i) => {
                return(
                  <div key={i} className={`big-card ${shuffle ? "shuffle" : "move"}`}>
                    <div className="big-card-title">
                      <h1>{reviews[index].username}</h1>
                    </div>
                    <div className="big-card-body">
                      <p>{reviews[index].message}</p>
                    </div>
                    <div className="big-card-footer">
                      <footer>{reviews[index].footer}</footer>
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



      {/* Workings */}

        <div className="landing-info-works">
          <div className="landing-info-works-title-container">
            <h3 className="landing-info-works-title">How WizzEros Works</h3>
          </div>
          <div className="landing-info-svg-purple-container">
            
            <div className="landing-info-works-steps-box">
              <div className="landing-info-works-steps-container step-f">
                <div className="landing-info-works-step">.1</div>
                  <h5 className="landing-info-works-text">WhizzEros is a new dating tool which can be used by anyone with an
                  account. The purpose behind WhizzEros is to connect people in a more
                  visual manner. The concept behind the app is that you are mathced with
                  a random person and you will then have.</h5>
                </div>
                <div className="landing-info-works-steps-container step-s">
                  <div className="landing-info-works-step">.2</div>
                    <h5 className="landing-info-works-text">WhizzEros is a new dating tool which can be used by anyone with an
                    account. The purpose behind WhizzEros is to connect people in a more
                    visual manner. The concept behind the app is that you are mathced with
                    a random person and you will then have.</h5>
                </div>
                <div className="landing-info-works-steps-container step-t">
                  <div className="landing-info-works-step">.3</div>
                    <h5 className="landing-info-works-text">WhizzEros is a new dating tool which can be used by anyone with an
                    account. The purpose behind WhizzEros is to connect people in a more
                    visual manner. The concept behind the app is that you are mathced with
                    a random person and you will then have.</h5>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default LandingPage