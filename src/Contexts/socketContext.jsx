import { io } from "socket.io-client"

import React, { useContext, useRef } from "react"

/*Creates a useContext to be used throughout the application*/
const AuthContext = React.createContext()

export function useSocket() {
    return useContext(AuthContext)
}

/*Used to create 1 instance of socket*/
export function SocketProvider({ children }) {

    const socket = useRef()

    socket.current = io("ws://localhost:8900")

    const value = {
        socket,
    }

    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )
}