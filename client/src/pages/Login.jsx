import React, { useEffect, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { clearLoginError, loginAsync, resetLoginStatus, selectLoginError, selectLoginStatus, selectUserInfo } from '../features/auth/AuthSlice';
import { useSelector, useDispatch } from 'react-redux';

export default function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    // Redux state selectors to access login status, errors, and user information
    const status = useSelector(selectLoginStatus)
    const error = useSelector(selectLoginError)
    const userInfo = useSelector(selectUserInfo);

    useEffect(() => {
        if (userInfo) {
            navigate("/")
        }

    }, [userInfo, navigate])

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    // Effect hook to show success message on successful login and reset Redux state
    useEffect(() => {
        if (status === "fullfilled") {
            toast.success("Login Successfull");
        }
        return () => {
            dispatch(clearLoginError())
            dispatch(resetLoginStatus())
        }
    }, [status, dispatch])

 // Form submission handler
    const handlesubmit = (e) => {
        e.preventDefault();

        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            toast.error("Invalid email address");
            return
        }

        const cred = { email, password };
        
        dispatch(loginAsync(cred));
    };


    return (
        <>
            <div className="container mt-5 mb-5 pb-5  pt-5 flex-center ">
                <div className="card">
                    <h1 className="text-center card-header text-white secondary-color  instagram">Welcome!</h1>
                    <div className="card-body">
                        <form onSubmit={handlesubmit}>
                            <div className="md-form">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                            </div>
                            <div className="md-form">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-skyblue btn_login_custom text-white">LOGIN</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <span className="font-weight-bold text-dark">Don't have an account</span>  <NavLink to="/signup" className="text-default font-weight-bold">Click here to Register </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
