import { io } from "socket.io-client"

import React, { useContext, useEffect, useRef } from "react"

const AuthContext = React.createContext()

export function useSocket() {
    return useContext(AuthContext)
}

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