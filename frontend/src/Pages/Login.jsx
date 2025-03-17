import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation  } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const url = `http://localhost:8080/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    /* const responseGoogle = (credentialResponse) => {
        console.log("Google Sign-In Success:", credentialResponse);
        window.location.href = "http://localhost:8080/auth/google";
    }; */

    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     const token = params.get("token");

    //     if (token) {
    //         localStorage.setItem("token", token);
    //         navigate("/home");
    //     }
    // }, []);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        console.log("Token from url: ", token);
        
        if (token) {
            localStorage.setItem("token", token);
            window.location.reload();
            // navigate("/home");
            
        }

        
    }, [location.search]);

    const clientId = "1015028759454-7742mgtciocpbagh1dhd8u6gn5i96c95.apps.googleusercontent.com";
    console.log("Google OAuth Client ID:", clientId);
    return (
        <GoogleOAuthProvider clientId={clientId}>

            <div className='container'>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={loginInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                        />
                    </div>
                    <button type='submit'>Login</button>
                    <span>Does't have an account ?
                        <Link to="/signup">Signup</Link>
                    </span>
                </form>

                {/* <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        console.log("Google Sign-In Success:", credentialResponse);
                        window.location.href = "http://localhost:8080/auth/google";
                    }}
                    onError={(error) => console.error("Google Sign-In Failed:", error)}
                /> */}

                {/* <GoogleLogin
                    onSuccess={() => {
                        window.location.href = "http://localhost:8080/auth/google"; // Redirect to backend
                    }}
                    onError={(error) => console.error("Google Sign-In Failed:", error)}
                /> */}

                <button onClick={() => window.location.href = "http://localhost:8080/auth/google"}>Sign in with Google</button>




                <ToastContainer />
            </div>

        </GoogleOAuthProvider>
    )
}

export default Login