import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../../Firebase";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../index.css'

function Reset() {
  const [email, setEmail] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/chat");
  }, [user, loading]);
  return (
    <div style={{ height: '80vh' }} className="my-3 d-flex align-items-center justify-content-center">
      <div className="row card opacity-75 bg-light shadow-lg border-0 rounded-lg optacity-50 m-3 p-3">
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button
          className="btn btn-primary my-3"
          onClick={() => sendPasswordReset(email)}
        >
          Send password to reset email
        </button>
        <div className="container my-2">
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Reset;