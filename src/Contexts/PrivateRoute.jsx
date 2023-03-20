import React from "react"
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

/*Enables private pages. if you are not logged in you will be redirected to the sign in page*/
const PrivateRoute = () => {
    const { user } = useAuth()
    return (
        user ? <Outlet /> : <Navigate to="/signin"/>
    )
}

export default PrivateRoute