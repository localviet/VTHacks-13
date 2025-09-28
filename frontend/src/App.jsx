//User Pages
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignUpPage from "./pages/SignUp.jsx";
import SignInPage from "./pages/SignIn.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Search from "./pages/Search.jsx";
import Settings from "./pages/Settings.jsx";

//Business
import DashboardBusiness from "./pages/Business/DashboardBusiness.jsx";
import BusinessSignUp from "./pages/Business/BusinessSignUp.jsx";
import BusinessSearch from "./pages/Business/BusinessSearch.jsx";
import BusinessSettings from "./pages/Business/BusinessSettings.jsx";

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/business/signup" element={<BusinessSignUp />} />
          <Route path="business/dashboard" element={<DashboardBusiness />} />
          <Route path="business/search" element={<BusinessSearch />} />
<<<<<<< HEAD
          <Route path="business/settings" element={<BusinessSettings />} />

=======
          <Route path="business/setting" element={<BusinessSettings />} />
>>>>>>> 926002ef34ad6511ecfbe0e985fad848ae3610b5
        </Routes>
      </Router>
    </>
  );
}

export default App;
