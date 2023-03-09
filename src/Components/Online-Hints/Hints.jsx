
import React, { useState, memo } from "react"
import { useEffect } from "react"
import "./HintsCss.css"
import { useAuth } from "../../Contexts/AuthContext"
import Loader from "../Loader"
import axios from "../../Contexts/axiosConfig"

function Hints({onlineUsers}) {

    const { user } = useAuth()
    const [question, setQuestion] = useState(null)

    const handleQuestion = async() => {
        const options = {
            method: 'GET',
            url: 'https://would-you-rather.p.rapidapi.com/wyr/random',
            headers: {
              'X-RapidAPI-Key': 'd28369a221mshce7373ca2e84dcep1d306cjsncafae953c3ba',
              'X-RapidAPI-Host': 'would-you-rather.p.rapidapi.com'
            }
          };
          
          const res = await axios.request(options)
          setQuestion(res.data[0].question)
          console.log(res.data)
    }  

    return(
        <div className="hints-container" >
            <div className="hints-header fcc">
                <h1>Hints</h1>
            </div>


            <div className="hints-main fcc">
                {question ? 
                    <div className="hints-question-container fcc">
                    <p>{question}</p>
                    </div>
                :
                    <div className="hints-question-container fcc">
                        <p>Click To Get A Question When Things Get Akward!</p>
                    </div>
                }
            </div>
            <div className="hints-footer fcc">
                <button onClick={handleQuestion} className="pButton profile-details-form-button">Question <span></span></button>
            </div>
        </div>
    )
}

export default memo(Hints)