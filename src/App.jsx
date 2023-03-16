import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Loader from "./Components/Loader"

import PrivateRoute from "./Contexts/PrivateRoute.jsx";

import Navigation from "./Components/navbar/Navigation.jsx";
import Footer from "./Components/Footer.jsx";

import Follow from "./Pages/Profile/Follow.jsx"
const LandingPage = lazy(() => import('./Pages/LandingPage/LandingPage.jsx'));
const SignUp = lazy(() => import('./Pages/LoginSystem/SignUp.jsx'));
const SignIn = lazy(() => import('./Pages/LoginSystem/SignIn.jsx'));
const HomePage = lazy(() => import('./Pages/HomePage/HomePage.jsx'));
const Profile = lazy(() => import('./Pages/Profile/Profile.jsx'));
const Chat = lazy(() => import('./Pages/Profile/Chat.jsx'));

 
function App() {
  return(
    <Router>
      <Navigation />
      <Suspense fallback={<div className=""><Loader /></div>}>
        <Routes>
          <Route exact path="/" element={<><LandingPage /><Footer /></>} />
          <Route path="/signup" element={<><SignUp /><Footer /></>} />
          <Route path="/signin" element={<><SignIn /><Footer /></>} />
          <Route element={<PrivateRoute/>} >
            <Route exact path="/homepage" element={<HomePage />} />
            <Route exact path="/homepage/profile" element={<Profile />} />
            <Route exact path="/homepage/follow" element={<Follow />} />
            <Route exact path="/homepage/follow/chat/:id" element={<Chat />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App;
