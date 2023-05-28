import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import '../styles/Details.css';
import hostname from './Host';

function DetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { todo } = location.state?location.state:{todo: null};
    const [activeTodo, setActiveTodo] = useState(null);
    const [prevProgress, setPrevProgress] = useState(0);
    const [progress, setProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [percTimeRemaining, setPercTimeRemaining] = useState(100);
    const [initialTimeRemaining, setInitialTimeRemaining] = useState(0);
    const [prevTimeRemaining, setPrevTimeRemaining] = useState(0);

    useEffect(() => {
        const isActive = localStorage.getItem('isActive');
        if ((isActive === 'false') || (!isActive)) {
            localStorage.setItem('isActive', false);
            navigate({
                pathname: '/login'
            });
        }
        if (!todo) {
            navigate({
                pathname: '/'
            });
        }
        if (todo) {
            setActiveTodo(todo);
        }
        }, [location, navigate]);

    useEffect(() => {
        if (activeTodo) {
            setPrevProgress(progress);
            setProgress(parseInt(Object.values(activeTodo.subtasks).filter(value => value === '1').length*100/Object.keys(activeTodo.subtasks).length));
            setInitialTimeRemaining(new Date(activeTodo.endTimestamp).getTime() - new Date(activeTodo.startTimestamp).getTime());
            setPrevTimeRemaining((isFinite(percTimeRemaining))?percTimeRemaining:100);
            setPercTimeRemaining((new Date(activeTodo.endTimestamp).getTime() - new Date().getTime())*100/initialTimeRemaining);
            setTimeRemaining(new Date(activeTodo.endTimestamp).getTime() - new Date().getTime());
        }
    }, [activeTodo, initialTimeRemaining]);

    const subtaskStatus = (subtask) => {
        const tmpTodo = {...activeTodo};
        tmpTodo.subtasks[subtask] = (tmpTodo.subtasks[subtask] == "1")?"0":"1";
        var completed = true;
        Object.values(tmpTodo.subtasks).forEach((value) => {
            if (value == "0") {
                completed = false;
                return null;
            }
        });
        tmpTodo.finished = completed;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tmpTodo)
        };
        fetch(hostname + '/api/update/todo/' + tmpTodo.title, requestOptions)
        .then(response => {
            if (response.ok) {
                setActiveTodo(tmpTodo);
            }
            else {
                console.log("Error Updating");
            }
        })
    }

    const starredBtn = (event) => {
        event.preventDefault();
        const tmpTodo = {...activeTodo};
        tmpTodo.starred = (tmpTodo.starred == false)?true:false;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tmpTodo)
        };
        fetch(hostname + '/api/update/todo/' + tmpTodo.title, requestOptions)
        .then(response => {
            if (response.ok) {
                setActiveTodo(tmpTodo);
            }
            else {
                console.log("Error Updating");
            }
        })
    }

    const homeBtn = (event) => {
        event.preventDefault();
        navigate({ pathname: '/' });
    }

    const calendarBtn = (event) => {
        event.preventDefault();
        navigate({ pathname: '/calendar' });
    }

    const addTaskBtn = (event) => {
        event.preventDefault();
        navigate({ pathname: '/add' });
    }

    const starBtn = (event) => {
        event.preventDefault();
        navigate({ pathname: '/star' });
    }

    const logoutBtn = (event) => {
        event.preventDefault();
        localStorage.setItem('isActive', false);
        navigate({ pathname: '/login' });
    }

    const deleteBtn = (event) => {
        fetch(hostname + '/api/todo/delete/' + activeTodo.title, { method: 'DELETE' })
        .then(request => {
            if (!request.ok) {
                console.log("Error Deleting");
            }
            else {
                navigate({
                    pathname: '/'
                });
            }
        });
    }    

    if ((activeTodo) && (todo)) {
        
        const progressanim = keyframes`
            0% {
                stroke-dashoffset: ${720 - 720*prevProgress/100};
            }
            100% {
                stroke-dashoffset: ${720 - 720*progress/100};
            }
        `;

        const ProgressStyledCircle = styled.circle`
            animation: ${progressanim} 2s linear forwards;
        `;
        
        const timeanim = keyframes`
            0% {
                stroke-dashoffset: ${(percTimeRemaining > 0)?720 - 720*prevTimeRemaining/100:720};
            }
            100% {
                stroke-dashoffset: ${(percTimeRemaining > 0)?720 - 720*percTimeRemaining/100:720};
            }
        `;

        const TimeStyledCircle = styled.circle`
            animation: ${timeanim} 2s linear forwards;
        `;

        function getTimeDifference(milliseconds) {
            const seconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(seconds / 60) % 60;
            const hours = Math.floor(seconds / 3600) % 24;
            const days = Math.floor(seconds / 86400);
          
            const timeString = `${days}D:${hours}H:${minutes}M`;
            return timeString;
        }
        return (
            <html lang="en">
                <head>
                    <title>Task</title>
                    <link rel="stylesheet" href="taskdetails.css" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                </head>
                <body>
                    <div class="sidepane">
                        <div class="homebtncontainer">
                            <button class="detailshomebtn" onClick={ homeBtn }>
                                <i class="fa-solid fa-house"></i>
                            </button>
                        </div>
                        <div class="calendarbtncontainer">
                            <button class="detailscalendarbtn" onClick={ calendarBtn }>
                                <i class="fa-solid fa-calendar"></i>
                            </button>
                        </div>
                        <div class="addbtncontainer">
                            <button class="detailsaddbtn" onClick={ addTaskBtn }>
                                <i class="fa-solid fa-calendar-plus"></i>
                            </button>
                        </div>
                        <div class="starbtncontainer">
                            <button class="detailsstarbtn" onClick={ starBtn }>
                                <i class="fa-solid fa-star"></i>
                            </button>
                        </div>
                        <div class="logoutbtncontainer">
                            <button class="logoutbtn" onClick={ logoutBtn }>
                                <i class="fa-solid fa-right-from-bracket"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mainpane">
                        <div class="detailspane">
                            <div class="titlecontainer">
                                <span><i class="fa-solid fa-tag"></i></span>
                                <div class="titlelabel">{ activeTodo.title }</div>
                            </div>
                            <div class="desccontainer">
                                <span><i class="fa-solid fa-align-left"></i></span>
                                <div class="desclabel">{ activeTodo.description }</div>
                            </div>
                            <div class="subtaskcontainer">
                                <table class="subtasktable">
                                    <tbody>
                                        { Object.keys(activeTodo.subtasks).map((subtask) => (
                                            <tr class="detailsrow">
                                                <td class="subtasklabelcell"><ul class="detailsul"><li style={{color: 'white'}}><label class="subtasklabel">{ subtask }</label></li></ul></td>
                                                <td class="subtaskdonecell"><button class="subtaskdone" onClick={() => subtaskStatus(subtask) }><i class="fa-sharp fa-solid fa-circle-check" style={{ color:(activeTodo.subtasks[subtask] == "1")?"greenyellow":"white"}}></i></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="datetimecontainer">
                                <span><i class="fa-solid fa-clock"></i></span>
                                <div class="datetimelabel">{ new Date(activeTodo.endTimestamp).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) } | { new Date(activeTodo.endTimestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/am|pm/i, (match) => match.toUpperCase()) }</div>
                            </div>
                            <div class="starcontainer">
                                <button class="starbutton" onClick={ starredBtn }><i class="fa-solid fa-star" style={{ color: (activeTodo.starred == false)?"white":"yellow" }} onMouseEnter={(e) => {e.target.style.color = (activeTodo.starred == false)?"yellow":"white"}} onMouseLeave={(e) => {e.target.style.color = (activeTodo.starred == false)?"white":"yellow"}}></i></button>
                            </div>
                        </div>
                        <div class="barscontainer">
                            <div class="timercontainer">
                                <div class="skill">
                                    <div class="outer">
                                        <div class="inner">
                                            <div class="bardata">{ (timeRemaining > 0)?getTimeDifference(timeRemaining):"0D:0H:0M" }</div>
                                        </div>
                                    </div>
                                    <div class="bar-container">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            version="1.1" width="260px"
                                            height="260px">
                                            <defs>
                                                <linearGradient id="GradientColor1">
                                                    <stop offset="0%" stop-color="#DA22FF" />
                                                    <stop offset="100%" stop-color="#9733EE" />
                                                </linearGradient>
                                            </defs>
                                            <TimeStyledCircle
                                                class="timer-circle"
                                                cx="130"
                                                cy="130"
                                                r="115"
                                                style={{
                                                    fill: 'none',
                                                    stroke: 'url(#GradientColor1)',
                                                    strokeWidth: '30px',
                                                    strokeDasharray: '720',
                                                    strokeDashoffset: '720',
                                                    strokeLinecap: 'round',
                                                    transformOrigin: 'center',
                                                    transform: 'rotate(-90deg)',
                                                }}
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="progresscontainer">
                                <div class="skill">
                                    <div class="outer">
                                        <div class="inner">
                                            <div class="progressdata">{ progress }%</div>
                                        </div>
                                    </div>
                                    <div class="bar-container">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            version="1.1" width="260px"
                                            height="260px">
                                            <defs>
                                                <linearGradient id="GradientColor2">
                                                    <stop offset="0%" stop-color="greenyellow" />
                                                    <stop offset="100%" stop-color="yellow" />
                                                </linearGradient>
                                            </defs>
                                            <ProgressStyledCircle
                                                class="progress-circle"
                                                cx="130"
                                                cy="130"
                                                r="115"
                                                style={{
                                                    fill: 'none',
                                                    stroke: 'url(#GradientColor2)',
                                                    strokeWidth: '30px',
                                                    strokeDasharray: '720',
                                                    strokeDashoffset: '720',
                                                    strokeLinecap: 'round',
                                                    transformOrigin: 'center',
                                                    transform: 'rotate(-90deg)',
                                                }}
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="trashcontainer">
                        <button class="trashbtn" onClick={ deleteBtn }><i class="fa-solid fa-trash"></i></button>
                    </div>
                </body>
            </html>
        )
}
else {
    return (
        <></>
    )
}
}


export default DetailsPage;