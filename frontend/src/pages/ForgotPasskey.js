import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hostname from "./Host";
import '../styles/ForgotPasskey.css'

function ForgotPasskeyPage() {
    const [email, setEmail] = useState(null);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(hostname + '/api/forgotpasskey', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email})
        })
        .then(response => {
            if (response.status === 200) {
                response.text().then((message) => {
                navigate('/otp', {state: {recieved_otp: message, email: email}});
            })}
            else {
                console.log(response.text());
                response.text().then((message) => { setErr(message) });
            }
        })
        .catch(error => {
            setErr(error.message);
        });
    }

    const LoginPageDirect = (event) => {
        event.preventDefault();
        navigate('/login');
    }

    return (
        <html lang="en">
            <head>
                <title>Forgot Password</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
            </head>
            <body className="forgotpasskey-body">
                <button className="back-btn" onClick={ LoginPageDirect }>
                    <i class="fa-solid fa-left-long"></i>
                </button>
                <form onSubmit={ handleSubmit }>
                    <div className="fp-main-container">
                        <div className="fp-email-container">
                            <span><i class="fa-solid fa-envelope"></i></span>
                            <input className="fp-email-input" type="email" placeholder="Email" value={ email } onChange={(e) => {setEmail(e.target.value)}}></input>
                        </div> 
                        <button className="fp-submit-btn"> Send OTP </button>
                        { err && <div className="fp-error">{ err } !</div> }
                    </div>
                </form>
            </body>
        </html>
    )
}

export default ForgotPasskeyPage