import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import PrivateRoute from "./Contexts/PrivateRoute.jsx";

import Navigation from "./Components/navbar/Navigation.jsx";
import Footer from "./Components/Footer.jsx";

import LandingPage from "./Pages/LandingPage/LandingPage.jsx"
import SignUp from "./Pages/LoginSystem/SignUp.jsx"
import SignIn from "./Pages/LoginSystem/SignIn.jsx"
import HomePage from "./Pages/HomePage/HomePage.jsx"
import Profile from "./Pages/Profile/Profile.jsx";
import Follow from "./Pages/Profile/Follow.jsx"
import Chat from "./Components/chat/Chat.jsx"
 
function App() {
  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<><Navigation /><LandingPage /><Footer /></>} />
        <Route path="/signup" element={<><Navigation /><SignUp /><Footer /></>} />
        <Route path="/signin" element={<><Navigation /><SignIn /><Footer /></>} />
        <Route element={<PrivateRoute/>} >
          <Route exact path="/homepage" element={<><Navigation /><HomePage /></>} />
          <Route exact path="/homepage/profile" element={<><Navigation /><Profile /></>} />
          <Route exact path="/homepage/follow" element={<><Navigation /><Follow /></>} />
          <Route exact path="/homepage/follow/chat/:id" element={<><Navigation /><Chat /></>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
