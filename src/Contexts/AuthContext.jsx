import React, { useContext, useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import axios from "./axiosConfig.jsx"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    
    const [user, setUser] = useState("a")//used to store user details after retrieved from DB
    const [flag, setFlag] = useState(false)

    useEffect(()=> {
        if(flag) {
            localStorage.setItem("userDetails", JSON.stringify(user));
        }
    },[user])
    
    useEffect(() => {
        const saved = localStorage.getItem("userDetails");
        setUser(JSON.parse(saved))
    }, [])

    const refreshToken = async() => { //method to refresh the tokens
        try {
            const res = await axios.post("/api/refresh", {refreshToken: user.refreshToken, id: user.id})
            await setUser({
                ...user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken
            })
            return res.data
        } catch (error) {
            console.log(error, "ERROR")
        }
    }

    const axiosAuth = axios.create() //needs to use this whenever you are trying to verify a request. e.g. logout, send message, ect.

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

    const value = {
        user,
        axiosAuth,
        setUser,
        setFlag
    }

    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )
}