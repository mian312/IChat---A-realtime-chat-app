import React, { useEffect, useState } from 'react'
import 'firebase/app'
import { auth, logInWithEmailAndPassword } from "../../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Eye, EyeSlash } from 'react-bootstrap-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, error] = useAuthState(auth);
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    logInWithEmailAndPassword(email, password);
  }

  useEffect(() => {
    if (user) navigate("/chat");
  }, [user]);
  return (
    <div style={{ height: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div >
        <div className="card bg-light opacity-75 shadow-lg border rounded-lg mx-auto p-2">
          <div className="card bg-light m-2 p-2 text-center">
            Login Form
          </div>
          <div className="card bg-light bg-transparent-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group m-2">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
                {email.length < 0 &&
                  <p className="text-danger">Please enter email</p>
                }
              </div>
              <div className="form-group m-2">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <input
                    type={passwordShown ? "text" : "password"}
                    className="form-control" id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)} />
                  <i style={{ cursor: 'pointer' }} className="input-group-text"
                    onClick={togglePassword}>
                    {!passwordShown
                      ? <EyeSlash size={24} />
                      : <Eye size={24} />
                    }
                  </i>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <button type="submit" className="btn btn-primary m-2"
                >Submit</button>
              </div>
            </form>
            <Link className="d-flex justify-content-center p-2" to="/reset">Forgot Password</Link>
          </div>
        </div>
        <span className="m-4 p-4">Don't have an account? <Link to="/register">Register</Link> now.</span>
      </div>
      <div className="continer">
      </div>
    </div>
  )
}
