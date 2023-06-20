import React, { useEffect, useState } from 'react'
import { GoogleOutlined, FacebookOutlined, MailOutlined } from '@ant-design/icons'
import 'firebase/app'
// import { auth } from '../Firebase'
import { auth, signInWithGoogle, signInWithFacebook } from "../../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../index.css'

export default function Login() {
  const [user, error] = useAuthState(auth);
  const navigate = useNavigate();
  function redirect() {
    navigate('/elogin')

  }
  useEffect(() => {
    if (user) navigate("/chat");
  }, [user]);
  return (
    <div style={{ height: '100vh' }} className='d-flex justify-content-center align-items-center'>
      <div className="card bg-light opacity-75 shadow-lg border-0 rounded-lg mx-auto py-2">
        <div className='row justify-content-center'>
          <div
            className="btn btn-primary mail m-1 col-10"
            onClick={redirect}
          >
            <MailOutlined /> Continue with Mail
          </div>
        </div>
        <div className='row justify-content-center'>
          <div
            className="btn btn-primary google m-1 col-10"
            onClick={signInWithGoogle}
          >
            <GoogleOutlined /> Continue with Google
          </div>
        </div>
        <div className='row justify-content-center'>
          <div
            className="btn btn-primary facebook m-1 col-10"
            onClick={signInWithFacebook}
          >
            <FacebookOutlined /> Continue with Facebook
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <span className="m-4">Don't have an account? <Link to="/register">Register</Link> now.</span>
        </div>
      </div>
    </div>
  )
}
