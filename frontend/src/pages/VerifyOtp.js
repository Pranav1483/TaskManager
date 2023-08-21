import React, {useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOtpPage() {
    const [otp, setOtp] = useState(null);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    var { recieved_otp, email } = location.state?location.state:{recieved_otp:'', email:''}

    useEffect(() => {
        if (!location.state || !location.state.hasOwnProperty('email') || !location.state.hasOwnProperty('recieved_otp')) {
            navigate('/forgot');
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (otp === recieved_otp) {
            navigate('/newpasskey', { state: {email: email} });
        }
        else {
            setErr('Wrong OTP');
        }
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
                            <span><i class="fa-solid fa-key"></i></span>
                            <input className="fp-email-input" placeholder="OTP" value={ otp } onChange={(e) => {setOtp(e.target.value)}}></input>
                        </div> 
                        <button className="fp-submit-btn"> Submit </button>
                        { err && <div className="fp-error">{ err } !</div> }
                    </div>
                </form>
            </body>
        </html>
    )
}

export default VerifyOtpPage;