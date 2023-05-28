import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css'
import MultiLineChart from "./LineGraph";
import hostname from "./Host";

function DashboardPage () {
    const [userObj, setUserObj] = useState(null);
    const [todoObj, setTodoObj] = useState(null);
    const [visibleTodoObj, setVisibleTodoObj] = useState(null);
    const [todoErr, setTodoErr] = useState(null);
    const [query, setQuery] = useState("");
    const [completed, setCompleted] = useState(0);
    const [progress, setProgress] = useState(0);
    const [incomplete, setIncomplete] = useState(0);
    const [numTasks, setNumTasks] = useState([0, 0, 0, 0, 0, 0, 0]);
    const navigate = useNavigate();

    useEffect(() => {
        const isActive = localStorage.getItem('isActive');
        if ((isActive === 'false') || (!isActive)) {
            localStorage.setItem('isActive', false);
            navigate({
                pathname: '/login'
            });
        }
        fetch(hostname + "/api/users/" + isActive)
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
            fetch(hostname + "/api/todo/" + data.id)
            .then(response => {
                if (!response.ok) {
                    setTodoErr('Error Obtaining Tasks !');
                    return [];
                }
                else {
                    return response.json();
                }
            })
            .then(data => {
                setTodoObj(data);
                if (query === "") {
                    setVisibleTodoObj(data);
                }
                setCompleted(0);
                setProgress(0);
                setIncomplete(0);
                data.forEach(item => {
                    if (item.finished == true) {
                        
                        setCompleted(prevCompleted => prevCompleted + 1);
                    }
                    else {
                        const end = new Date(item.endTimestamp);
                        const now = new Date();
                        if (now < end) {
                            setProgress(prevProgress => prevProgress + 1);
                        }
                        else {
                            setIncomplete(prevIncomplete => prevIncomplete + 1);
                        }
                    }
                });
                function isInSameWeek(date, referenceDate) {
                    const oneDay = 24 * 60 * 60 * 1000;
                    const firstDayOfWeek = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() - referenceDate.getDay());
                    const lastDayOfWeek = new Date(firstDayOfWeek.getTime() + (6 * oneDay));
                    return date >= firstDayOfWeek && date <= lastDayOfWeek;
                }
                setNumTasks([0, 0, 0, 0, 0, 0, 0]);
                data.forEach(todo => {
                    if (isInSameWeek(new Date(todo.endTimestamp), new Date())) {
                        const endDate = new Date(todo.endTimestamp);
                        setNumTasks(prevNumTasks => {
                            const updatedNumTasks = [...prevNumTasks];
                            updatedNumTasks[endDate.getDay()] = updatedNumTasks[endDate.getDay()] + 1;
                            return updatedNumTasks;
                        });
                    }
                });
            })
            .catch(error => {
                setTodoErr('Error Obtaining Tasks !');
            });
        })
        .catch(error => {
            localStorage.setItem('isActive', false);
            navigate({
                pathname: '/login'
            });
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

    const searchBtn = (event) => {
        event.preventDefault();
        if (query !== "") {
            setVisibleTodoObj([]);
            todoObj.forEach(item => {
                if ((item['title'].toLowerCase().includes(query.toLowerCase())) || (item['description'].toLowerCase().includes(query.toLowerCase()))) {
                    setVisibleTodoObj(prevArray => [...prevArray, item]);
                }
            });
        }
        else if (query === "") {
            setVisibleTodoObj(todoObj);
        }
    }

    const statusBtn = (todo) => {
        navigate('/taskdetails', { state: {todo: todo} });
    }

    const handleKeyPress = (event) => {
        event.preventDefault();
        if (query !== "") {
            setVisibleTodoObj([]);
            todoObj.forEach(item => {
                if ((item['title'].toLowerCase().includes(query.toLowerCase())) || (item['description'].toLowerCase().includes(query.toLowerCase()))) {
                    setVisibleTodoObj(prevArray => [...prevArray, item]);
                }
            });
        }
        else if (query === "") {
            setVisibleTodoObj(todoObj);
        }
    };

    if ((!userObj) || (!todoObj)) {
        return (
            <div className="screen-loader-container">
                <div className="screen-loader"></div>
            </div>)
    }
    else {
        const currentDate = new Date()
        const LineData = [
            ['Day', 'Tasks', {type: 'string', role: 'style'}, { type: 'number', role: 'interval'}],
            ['Sun', numTasks[0], (currentDate.getDay() >= 0 ? '#8400ff' : 'grey'), (currentDate.getDay() == 0 ? numTasks[0] : null)],
            ['Mon', numTasks[1], (currentDate.getDay() >= 1 ? '#8400ff' : 'grey'), (currentDate.getDay() == 1 ? numTasks[1] : null)],
            ['Tue', numTasks[2], (currentDate.getDay() >= 2 ? '#8400ff' : 'grey'), (currentDate.getDay() == 2 ? numTasks[2] : null)],
            ['Wed', numTasks[3], (currentDate.getDay() >= 3 ? '#8400ff' : 'grey'), (currentDate.getDay() == 3 ? numTasks[3] : null)],
            ['Thu', numTasks[4], (currentDate.getDay() >= 4 ? '#8400ff' : 'grey'), (currentDate.getDay() == 4 ? numTasks[4] : null)],
            ['Fri', numTasks[5], (currentDate.getDay() >= 5 ? '#8400ff' : 'grey'), (currentDate.getDay() == 5 ? numTasks[5] : null)],
            ['Sat', numTasks[6], (currentDate.getDay() >= 6 ? '#8400ff' : 'grey'), (currentDate.getDay() == 6 ? numTasks[6] : null)],
          ];
        
    return (
        <html lang="en">
            <head>
                <title>Dashboard</title>
                <link rel="stylesheet" href="dashboard.css"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
            </head>
            <body>
                <div class="sidepane">
                    <div class="homebtncontainer">
                        <button class="homehomebtn" onClick={ homeBtn }>
                            <i class="fa-solid fa-house"></i>
                        </button>
                    </div>
                    <div class="calendarbtncontainer">
                        <button class="homecalendarbtn" onClick={ calendarBtn }>
                            <i class="fa-solid fa-calendar"></i>
                        </button>
                    </div>
                    <div class="addbtncontainer">
                        <button class="homeaddbtn" onClick={ addTaskBtn }>
                            <i class="fa-solid fa-calendar-plus"></i>
                        </button>
                    </div>
                    <div class="starbtncontainer">
                        <button class="homestarbtn" onClick={ starBtn }>
                            <i class="fa-solid fa-star"></i>
                        </button>
                    </div>
                    <div class="logoutbtncontainer">
                        <button class="logoutbtn" onClick={ logoutBtn }>
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                </div>
                <div class="searchbarcontainer">
                    <form onSubmit={ handleKeyPress }>
                    <button type="submit" class="searchbtn" onClick={ searchBtn } ><i class="fa-solid fa-magnifying-glass"></i></button>
                    <input type="text" class="searchtextbox" placeholder="Search Task" onChange={ (e) => setQuery(e.target.value) }/>
                    </form>
                </div>
                <div class="userboardcontainer">
                    <div class="usricn">
                        <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <label class="fullname">{userObj.fname.toUpperCase()}</label>
                    <div class="usrdetails">
                        <div class="pending">
                            <span><i class="fa-sharp fa-solid fa-circle-exclamation"></i></span>
                            <label>{ incomplete }</label>
                        </div>
                        <div class="progress">
                            <span><i class="fa-solid fa-hourglass"></i></span>
                            <label>{ progress }</label>
                        </div>
                        <div class="completed">
                            <span><i class="fa-solid fa-square-check"></i></span>
                            <label>{ completed }</label>
                        </div>
                    </div>
                </div>
                <div class="chartcontainer">
                    <MultiLineChart LineData={ LineData } />
                </div>
                <div class="tablecontainer">
                    <table class="tasktable">
                        { visibleTodoObj.map((todo) => (
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
    )}
}

export default DashboardPage