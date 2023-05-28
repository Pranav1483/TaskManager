import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Star.css'
import hostname from "./Host";

function StarPage () {
    const [userObj, setUserObj] = useState(null);
    const [startodoObj, setStarTodoObj] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const isActive = localStorage.getItem('isActive');
        if ((isActive === 'false') || (!isActive)) {
            localStorage.setItem('isActive', false);
            navigate({
                pathname: '/login'
            });
        }

        fetch(hostname + '/api/users/' + isActive)
        .then(response => {
            if (!response.ok) {
                localStorage.setItem('isActive', false);
                navigate({
                    pathname: '/login'
            });
            }
            return response.json();
        })
        .then(data => {
            setUserObj(data);
            fetch(hostname + '/api/todo/' + data.id)
            .then(response => {
                if (!response.ok) {
                    return [];
                }
                return response.json();
            })
            .then(data => {
                setStarTodoObj([]);
                data.forEach(todo => {
                    if (todo.starred == true) {
                        setStarTodoObj(prevStarTodoObj => [...prevStarTodoObj, todo]);
                    }
                })
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });
    }, [navigate]);

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

    const statusBtn = (todo) => {
        navigate('/taskdetails', {state: {todo: todo}});
    }

    if (!userObj) {
        return (
            <div className="screen-loader-container">
                <div className="screen-loader"></div>
            </div>
        )
    }

    else {
        return (
            <html lang="en">
                <head>
                    <title>Starred</title>
                    <link rel="stylesheet" href="starred.css" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                </head>
                <body>
                    <div class="sidepane">
                        <div class="homebtncontainer">
                            <button class="starhomebtn" onClick={ homeBtn }>
                                <i class="fa-solid fa-house"></i>
                            </button>
                        </div>
                        <div class="calendarbtncontainer" onClick={ calendarBtn }>
                            <button class="starcalendarbtn">
                                <i class="fa-solid fa-calendar"></i>
                            </button>
                        </div>
                        <div class="addbtncontainer" onClick={ addTaskBtn }>
                            <button class="staraddbtn">
                                <i class="fa-solid fa-calendar-plus"></i>
                            </button>
                        </div>
                        <div class="starbtncontainer" onClick={ starBtn }>
                            <button class="starstarbtn">
                                <i class="fa-solid fa-star"></i>
                            </button>
                        </div>
                        <div class="logoutbtncontainer" onClick={ logoutBtn }>
                            <button class="logoutbtn">
                                <i class="fa-solid fa-right-from-bracket"></i>
                            </button>
                        </div>
                    </div>
                    <div class="startablecontainer">
                        <table class="startasktable">
                            { startodoObj.map((todo) => (
                                <tr key={ todo.id }>
                                    <td class="taskcell">{ todo.title }</td>
                                    <td class="datecell">{ new Date(todo.endTimestamp).toLocaleDateString('en-IN', {day: '2-digit', month: 'long', year: 'numeric', minimumIntegerDigits: 4 }) }</td>
                                    <td class="timecell">{ new Date(todo.endTimestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/am|pm/i, (match) => match.toUpperCase()) }</td>
                                    <td class="statuscell">
                                        {(todo.finished == true) ? (
                                            <button class="completedcontainer" onClick={() => statusBtn(todo)}>
                                                <label style={{color: "rgb(4, 255, 0)"}}>Completed</label>
                                            </button>
                                        ) : (new Date(todo.endTimestamp) > new Date()) ? (
                                            <button class="inprogresscontainer" onClick={() => statusBtn(todo)}>
                                                <label style={{color: "rgb(255, 170, 0)"}}>In Progress</label>
                                            </button>
                                        ) : (
                                            <button class="notcompletedcontainer" onClick={() => statusBtn(todo)}>
                                                <label style={{color: "rgb(190, 85, 255)"}}>Not Complete</label>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) }
                        </table>
                    </div>
                </body>
            </html>
        )
    }
}

export default StarPage;