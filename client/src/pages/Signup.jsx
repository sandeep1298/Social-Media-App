import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';
import { clearSignupError, resetSignupStatus, selectSignupError, selectSignupStatus, selectUserInfo, signupAsync } from '../features/auth/AuthSlice';


export default function Signup() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const status = useSelector(selectSignupStatus)
    const error = useSelector(selectSignupError)
    const userInfo = useSelector(selectUserInfo);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    useEffect(() => {
        if (userInfo) {
            navigate("/")
        }

    }, [userInfo, navigate])

    useEffect(() => {
        if (status === "fullfilled") {
            toast.success("Signup successful!");

        }
        return () => {
            dispatch(clearSignupError())
            dispatch(resetSignupStatus())
        }
    }, [status, dispatch]);

    const handlesubmit = (e) => {
        e.preventDefault();

        // Validate the email address
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            toast.error("Invalid email address");
            return;
        }

        const cred = { name, email, password };

        dispatch(signupAsync(cred));
    };
    return (
        <>
            <div className="container mt-5 mb-5 pb-5  pt-5 flex-center ">
                <div className="card">
                    <h1 className="text-center card-header text-white secondary-color instagram">Welcome! Register Here</h1>
                    <div className="card-body">
                        <form onSubmit={handlesubmit}>
                            <div className="md-form">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                            </div>
                            <div className="md-form">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                            </div>
                            <div className="md-form">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-skyblue btn_login_custom text-white"
                                    disabled={status === "pending"}
                                > {status === "pending" ? "Signing Up..." : "Sign Up"}</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <span className="text-default">  <NavLink to="/login" className="font-weight-bold text-default" >Click Here </NavLink></span>  <span className="font-weight-bold text-dark">if already have an Account </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}