import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Loader from "./Components/Loader"

import PrivateRoute from "./Contexts/PrivateRoute.jsx";

const Navigation = lazy(() => import('./Components/navbar/Navigation.jsx'));
const Footer = lazy(() => import('./Components/Footer.jsx'));

const LandingPage = lazy(() => import('./Pages/LandingPage/LandingPage.jsx'));
const SignUp = lazy(() => import('./Pages/LoginSystem/SignUp.jsx'));
const SignIn = lazy(() => import('./Pages/LoginSystem/SignIn.jsx'));
const HomePage = lazy(() => import('./Pages/HomePage/HomePage.jsx'));
const Profile = lazy(() => import('./Pages/Profile/Profile.jsx'));
const Follow = lazy(() => import('./Pages/Profile/Follow.jsx'));
const Chat = lazy(() => import('./Components/chat/Chat.jsx'));

 
function App() {
  return(
    <Router>
      <Suspense fallback={<div className="loader-center"><Loader /></div>}>
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
      </Suspense>
    </Router>
  )
}

export default App;
