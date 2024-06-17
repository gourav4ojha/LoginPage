import './App.css';
import {Route, Routes} from "react-router-dom"
import Home from './pages/Home';

import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from  './pages/ResetPassword';
import {GoogleOAuthProvider} from '@react-oauth/google'
// import dotenv from 'dotenv';
// dotenv.config();
// const GoogleId  = process.env.GOOGLE_CLIENT_ID;


function App() {
  return (
    <>
    <GoogleOAuthProvider clientId="658716736046-lrhfa8d733m376vdf0n8mqerpoct6o1v.apps.googleusercontent.com">
    <Routes>
      <Route  path="/" element={<Home />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
