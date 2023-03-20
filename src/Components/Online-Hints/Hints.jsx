
import React, { useState, memo } from "react"
import "./HintsCss.css"
import axios from "../../Contexts/axiosConfig"


function Hints() {

    const [question, setQuestion] = useState(null)

    /*Function that makes an RAPID API call to get a question*/
    const handleQuestion = async(e) => {
        e.stopPropagation() 

        const options = {
            method: 'GET',
            url: process.env.REACT_APP_RAPIDAPIURL,
            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPIKEY,
              'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPIHOST
            }
          };
          
          const res = await axios.request(options)
          setQuestion(res.data[0].question)
    }  


    return(
        <div className="hints-container" >
            <div className="hints-header fcc">
                <h2>Hints</h2>
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
                <button onClick={(e) => {handleQuestion(e)}} className="pButton profile-details-form-button">Question <span></span></button>
            </div>
        </div>
    )
}

export default memo(Hints)