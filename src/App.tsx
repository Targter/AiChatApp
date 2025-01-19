import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Page1 from './page/page1';
import RegisterUser from "./components/RegisterUser"
import Login from "./components/Login"
// import 'regenerator-runtime/runtime';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPasswordPage from "./components/ResetPasswordPage";

function App() {


  return (
    <>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/Register" element={<RegisterUser/>} />
            <Route path="/Login" element={<Login/>} />
            <Route path="/ForgetPassword" element={<ResetPasswordPage/>} />
            <Route path="/"
            element={<Page1 /> }
          />
          </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
