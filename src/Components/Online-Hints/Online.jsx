
import React, { useState, memo } from "react"
import { useEffect } from "react"
import "./OnlineCss.css"
import { useAuth } from "../../Contexts/AuthContext"
import Loader from "../Loader"

function Online({onlineUsers}) {

    const { user, axiosAuth } = useAuth()

    const [friends, setFriends] = useState(null)
    const [onlineFriends, setOnlineFriends] = useState(null)

    useEffect(() => {
        const getFriends = async() => {
            try {
                const res = await axiosAuth.post("/api/retrieve_friends", { 
                    id: user.id,
                },
                { headers: 
                    { authorization: "Bearer " + user.accessToken}
                })
                setFriends(res.data)
            } catch (error) {
            }
        }

        getFriends()
        
    },[user.friendslist])


    useEffect(() => {
        try {
            if(friends){
                setOnlineFriends(friends.filter((value) => {
                if (onlineUsers[value.users_id]){
                    return value
                }
               }))
            }
        } catch (error) {
        }
    },[onlineUsers, friends])

    return(
        <div className="online-container" >
            <div className="online-header fcc">
                <h2>Online Friends</h2>
            </div>
            <div className={`online-body ${!onlineUsers && !friends && 'fcc'} `}>
                {onlineUsers 
                    ?
                    onlineFriends?.length == 0
                    ?
                    <p className="online-noonline">No Friends Online</p>
                    :
                    onlineFriends?.map((value) => {
                        return(
                            <div key={value.users_id} className="online-indv">
                                <div className="online-indv-pfp">
                                    <img loading="lazy" className="online-indv-pic" src={value.profile_pic} />
                                    <div className="online-indv-status" />
                                </div>
                                <h2>{value.username}</h2>
                            </div>
                        )
                    })
                    :
                    <Loader />
                }
            </div>
        </div>
    )
}

export default memo(Online)