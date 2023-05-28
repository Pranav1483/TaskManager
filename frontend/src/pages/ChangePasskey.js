import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import hostname from "./Host";
import '../styles/ChangePasskey.css'

function ChangePasskeyPage() {
    const [newPasskey, setNewPasskey] = useState(null);
    const [confirmNewPasskey, setConfirmNewPasskey] = useState(null);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state?location.state:{email: ''}

    useEffect(() => {
        if (!location.state || !location.state.hasOwnProperty('email')) {
            navigate('/forgot');
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newPasskey !== confirmNewPasskey) {
            setErr('Passwords Do Not Match');
            return null;
        }
        fetch(hostname + '/api/update/users/' + email, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({passkey: newPasskey})
        })
        .then(request => {
            if (request.status === 200) {
                navigate('/login');
            }
            else {
                request.text().then((message) => {
                    setErr(message);
                })
            }
        })
        .catch(error => {
            setErr('Unknown Error');
            console.log(error);
        });
    }

    return (
        <html lang="en">
            <head>
                <title>Change Passkey</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
            </head>
            <body className="forgotpasskey-body">
                <form onSubmit={ handleSubmit }>
                    <div className="fp-main-container">
                        <div className="fp-email-container">
                            <span><i class="fa-solid fa-lock-open"></i></span>
                            <input className="fp-email-input" placeholder="New Password" type="password" value={ newPasskey } onChange={(e) => {setNewPasskey(e.target.value)}}></input>
                        </div>
                        <div className="fp-email-container">
                            <span><i class="fa-solid fa-lock"></i></span>
                            <input className="fp-email-input" placeholder="Confirm Password" type="password" value={ confirmNewPasskey } onChange={(e) => {setConfirmNewPasskey(e.target.value)}}></input>
                        </div> 
                        <button className="fp-submit-btn">Submit</button>
                        { err && <div className="fp-error">{ err } !</div> }
                    </div>
                </form>
            </body>
        </html>
    )
}

export default ChangePasskeyPage;