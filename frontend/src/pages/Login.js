import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'
import hostname from './Host';

function LoginPage() {

    const [username, setUsername] = useState('');
    const [passkey, setPasskey] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isActive = localStorage.getItem('isActive');
        if ((isActive !== 'false') && (isActive)) {
            navigate({
                pathname: '/',
            });
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(hostname + '/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, passkey: passkey })
        })
        .then((response) => {
            if (response.status === 200) {
                localStorage.setItem('isActive', username);
                navigate ({
                    pathname: '/',
                });
            }
            else if (response.status === 401) {
                setError('Wrong Password !');
            }
            else if (response.status === 404) {
                setError('No User Found !');
            }
            else {
                setError('Unknown Error');
            }
        })
        .catch(error => {
            console.log(error);
            setError('Unknown Error')
        });
    }

    const handleSignUp = (event) => {
        event.preventDefault();
        navigate({
            pathname: '/register'
        });
    }

    return (
        <html>
        <head>
            <title>Login</title>
            <link rel="stylesheet" href="../styles/Login.css"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
        </head>
        <body>
            <div class="box1">
                <label class="title1">LOGIN</label>
                <br/>
                <br/>
                <div class="box2">
                    <span><i class="fa-solid fa-user"></i></span>
                    <input type="text" class="textbox" placeholder="Username" value={ username } onChange={ (e) => setUsername(e.target.value) }/>
                </div>
                <br/>
                <br/>
                <div class="box2">
                    <span><i class="fa-solid fa-lock"></i></span>   
                    <input type="password" class="textbox" placeholder="*******" value={ passkey } onChange={ (e) => setPasskey(e.target.value) }/>
                </div>
                <a class="forgotpwd" href="/forgot">Forgot Password</a>
                <div class="buttondiv">
                    <button class="button1" onClick={ handleSubmit }>LOGIN</button>
                </div>
                <div class="errordiv">
                    {error && <p class="error">{ error }</p>}
                </div>
                <div class="buttondiv">
                    <button class="button2" onClick={ handleSignUp }>Sign Up</button>
                </div>
            </div>
        </body>
        </html>
    );
}

export default LoginPage;