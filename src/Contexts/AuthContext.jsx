import React, { useContext, useEffect, useState, useRef } from "react"
import jwt_decode from "jwt-decode"
import axios from "./axiosConfig.jsx"

/*Creates a context with variables that can be used throughout the whole application*/
const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    
    /*Variables that will be exported throughout the whole app*/
    const [user, setUser] = useState("a")
    const [flag, setFlag] = useState(false)
    const [roomId, setRoomId] = useState(null)
    const connectionRef = useRef()


    /*UseEffect to store details in local storage*/
    useEffect(()=> {
        if(flag) {
            localStorage.setItem("userDetails", JSON.stringify(user));
        }
    },[user])
    

    /*UseEffect to retrieve items from the local storage*/
    useEffect(() => {
        const saved = localStorage.getItem("userDetails");
        setUser(JSON.parse(saved))
    }, [])


    /* Function that will generate a new Refresh and Acess Token*/
    const refreshToken = async() => { 
        try {
            const res = await axios.post("/api/login/refresh", {
                id: user.id
            },{
                withCredentials: true 
            })
            setUser({
                ...user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken
            })
            return res.data
        } catch (error) {
            console.log(error, "ERROR")
        }
    }


    /*needs to use this whenever you are trying to verify a request. e.g. logout, send message, ect.*/
    const axiosAuth = axios.create() 

    /*Interceptors that check when a new access token needs to be created*/
    axiosAuth.interceptors.request.use(async (config) => { //checks if the token is expired after every request
        let currentDate = new Date()
        const decodedToken = jwt_decode(user.accessToken)
        if (decodedToken.exp * 1000 < currentDate.getTime() && user !== "a") {
        let data
        while (!data) {
            data = await refreshToken()
        }
        config.headers["authorization"] = "Bearer " + data.accessToken
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    /* Export all the values that need to be used elsewhere*/
    const value = {
        user,
        axiosAuth,
        setUser,
        flag,
        setFlag,
        connectionRef,
        roomId,
        setRoomId,
    }

    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )
}