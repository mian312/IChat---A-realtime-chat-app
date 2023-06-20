import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword,
    signInWithGoogle,
    signInWithFacebook
} from "../../Firebase";
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';



function Register() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState();
    const [statusMessage, setStatusMessage] = useState([]);
    const [name, setName] = useState(null);
    const [user, loading, error] = useAuthState(auth);
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const register = (e) => {
        e.preventDefault();
        const newErrors = [];

        if (!name) {
            newErrors.name = "Please enter name";
        }
        if (!email) {
            newErrors.email = "Please enter email";
        }
        if (!password) {
            newErrors.password = "Please enter password";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password does not match";
        }
        if (Object.keys(newErrors).length > 0) {
            setStatusMessage(newErrors);
        }
        else {
            registerWithEmailAndPassword(name, email, password);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/chat");
    }, [user, loading, error]);

    return (
        <div className="card w-75 opacity-75 bg-light shadow-lg border-0 rounded-lg m-auto my-5">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-md-6">
                    <form onSubmit={register}>
                        <div className="form-group m-3">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                            />
                            {statusMessage.name &&
                                <p className="text-danger">{statusMessage.name}</p>
                            }
                        </div>
                        <div className="form-group m-3">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                            />
                            {statusMessage.email &&
                                <p className="text-danger">{statusMessage.email}</p>
                            }
                        </div>
                        <div className="form-group m-3">
                            <label htmlFor="password">Password</label>
                            <div className="input-group">
                                <input
                                    type={passwordShown ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                />
                                <i style={{ cursor: 'pointer' }} className="input-group-text"
                                    onClick={togglePassword}>
                                    {!passwordShown
                                        ? <EyeSlash size={24} />
                                        : <Eye size={24} />
                                    }
                                </i>
                            </div>
                            {statusMessage.password &&
                                <p className="text-danger">{statusMessage.password}</p>
                            }
                        </div>
                        <div className="form-group m-3">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-control"
                            />
                            {statusMessage.confirmPassword &&
                                <p className="text-danger">{statusMessage.confirmPassword}</p>
                            }
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary m-3 center"
                            >Sign Up</button>
                        </div>
                        <div className='container d-flex justify-content-center'>
                            <div
                                className="btn btn-primary google m-1"
                                onClick={signInWithGoogle}
                            >
                                <GoogleOutlined /> Sign Up with Google
                            </div>

                            <p className='d-flex align-items-center justify-content-center m-2'> OR </p>

                            <div
                                className="btn btn-primary facebook m-1"
                                onClick={signInWithFacebook}
                            >
                                <FacebookOutlined /> Sign Up with Facebook
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <span className="my-4">Already have an account? <Link to="/" className="text-decoration-none">Login</Link> now.</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Register;