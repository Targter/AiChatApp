import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pagecon from './page/Pagecon';
import React from 'react';
import RegisterUser from "./components/RegisterUser"
import Login from "./components/Login"
// import 'regenerator-runtime/runtime';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPasswordPage from "/src/components/ResetPasswordPage";
import { PremiumBanner } from './components/PremiumBanner';

function App() {


  return (
    <>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/Register" element={<RegisterUser/>} />
            <Route path="/Login" element={<Login/>} />
            <Route path="/ForgetPassword" element={<ResetPasswordPage/>} />
            <Route path="/"
            element={<Pagecon /> }
          />
          <Route path='/subscription' element ={<PremiumBanner/>}/>
          </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
