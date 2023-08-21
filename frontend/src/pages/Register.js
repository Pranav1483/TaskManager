import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hostname from "./Host";
import '../styles/Register.css';

function RegisterPage() {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [passkey, setPasskey] = useState('');
    const [confirmPasskey, setConfirmPasskey] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (passkey !== confirmPasskey) {
            setError('Passwords Mismatch');
            return null;
        }
        fetch(hostname + '/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ fname: fname, lname: lname, email: email, username: username, passkey: passkey })
        })
        .then((response) => {
            if ((response.status === 400) || (response.status === 409)) {
                response.text().then((message) => { setError(message) });
            }
            else if (response.status === 200) {
                navigate('/login');
            }
        })
        .catch(error => {
            console.log(error);
            setError('Unknown Error');
        });
    }
    const LoginPageDirect = (event) => {
        event.preventDefault();
        navigate('/login');
    }

    return (
        <html lang="en">
            <head>
                <title>Register</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
            </head>
            <body className="register-body">
                <button className="back-btn" onClick={ LoginPageDirect }>
                    <i class="fa-solid fa-left-long"></i>
                </button>
                <form onSubmit={ handleSubmit }>
                    <div className="main-container">
                        <div className="fname-container">
                            <span><i class="fa-solid fa-user-tag"></i></span>
                            <input type="text" className="fname-input"placeholder="First Name" value={ fname } onChange={(e) => setFname(e.target.value)}></input>
                        </div>
                        <div className="lname-container">
                            <span><i class="fa-solid fa-user-tag"></i></span>
                            <input type="text" className="lname-input"placeholder="Last Name" value={ lname } onChange={(e) => setLname(e.target.value)}></input>
                        </div>
                        <div className="username-container">
                            <span><i class="fa-solid fa-at"></i></span>
                            <input type="text" className="username-input"placeholder="Username" value={ username } onChange={(e) => setUsername(e.target.value)}></input>
                        </div>
                        <div className="email-container">
                            <span><i class="fa-solid fa-envelope"></i></span>
                            <input type="email" className="email-input"placeholder="Email" value={ email } onChange={(e) => setEmail(e.target.value)}></input>
                        </div>
                        <div className="passkey-container">
                            <span><i class="fa-solid fa-unlock"></i></span>
                            <input type="password" className="passkey-input"placeholder="Password" value={ passkey } onChange={(e) => setPasskey(e.target.value)}></input>
                        </div>
                        <div className="confirmPasskey-container">
                            <span><i class="fa-solid fa-lock"></i></span>
                            <input type="password" className="confirmPasskey-input"placeholder="Confirm Password" value={ confirmPasskey } onChange={(e) => setConfirmPasskey(e.target.value)}></input>
                        </div>
                        {error && <label className="error-label">{ error } !</label>}
                        <button className="signup-btn">Register</button>
                    </div>
                </form>
            </body>
        </html>
    )
}

export default RegisterPage;