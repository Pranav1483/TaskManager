import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import hostname from "./Host";
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css'

function CalendarPage() {
    const [pickedDate, setPickedDate] = useState(null);
    const [userObj, setUserObj] = useState(null);
    const [todoObj, setTodoObj] = useState(null);
    const [activeTodo, setActiveTodo] = useState([]);
    const [taskDates, setTaskDates] = useState([]);
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
                    return [];
                }
                else {
                    return response.json();
                }
            })
            .then(data => {
                setTodoObj(data);
                if (!pickedDate) {
                    setActiveTodo(data);
                }
                if (data) {
                    setTaskDates([]);
                    data.forEach((todo) => {
                        if (!todo.finished) {
                            setTaskDates(prevTaskDates => [...prevTaskDates, todo.endTimestamp.split('T')[0]]);
                        }
                    });
                }})
            .catch(error => {
                console.log('Error Fetching Todo');
            });
        })
        .catch(error => {
            console.log('Error Fetching User');
        });
    }, [navigate]);

    useEffect(() => {
        if (pickedDate) {
            setActiveTodo([]);
            todoObj.forEach((todo) => {
                const year = pickedDate.getFullYear();
                const month = String(pickedDate.getMonth() + 1).padStart(2, '0');
                const day = String(pickedDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                if (formattedDate === todo.endTimestamp.split('T')[0]) {
                    setActiveTodo(prevActiveTodo => [...prevActiveTodo, todo]);
                }
            })
        }
        else {
            setActiveTodo(todoObj?todoObj:[]);
        }
    }, [pickedDate]);

    const taskBtnClick = (task) => {
        navigate('/taskdetails', {state: {todo: task}});
    }

    const dateBtnClick = (clickedDate) => {
        setPickedDate(clickedDate);
    }

    const tileContent = ({ date }) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        if (taskDates.includes(formattedDate)) {
            return <div className="date-dot"></div>;
        }
        else {
            return null;
        }
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

    const tileClassName = ({ date }) => {
        const classNames = [];
        if (date.getDay() === 0) {
          classNames.push('sunday');
        }
        const today = new Date();
        if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        ) {
          classNames.push('current-date');
        }
        return classNames.join(' ');
    };

    const handleUnselect = (event) => {
        setPickedDate(null);
    }

    if (userObj) {
        return (
        <html lang="en">
            <head>
                <title>Calendar</title>
                <link rel="stylesheet" href="calendarpage.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body>
                <div class="sidepane">
                    <div class="homebtncontainer">
                        <button class="calendarhomebtn" onClick={ homeBtn }>
                            <i class="fa-solid fa-house"></i>
                        </button>
                    </div>
                    <div class="calendarbtncontainer">
                        <button class="calendarcalendarbtn" onClick={ calendarBtn }>
                            <i class="fa-solid fa-calendar"></i>
                        </button>
                    </div>
                    <div class="addbtncontainer">
                        <button class="calendaraddbtn" onClick={ addTaskBtn }>
                            <i class="fa-solid fa-calendar-plus"></i>
                        </button>
                    </div>
                    <div class="starbtncontainer">
                        <button class="calendarstarbtn" onClick={ starBtn }>
                            <i class="fa-solid fa-star"></i>
                        </button>
                    </div>
                    <div class="logoutbtncontainer" onClick={ logoutBtn }>
                        <button class="logoutbtn">
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                </div>
                <div class="calendarcontainer">
                    <Calendar tileClassName={ tileClassName } showNeighboringMonth={ false } tileContent={ tileContent } onChange={dateBtnClick } value={ pickedDate } />
                    <button class="clear-filter-btn" onClick={ handleUnselect }><i class="fa-solid fa-rotate-right"></i></button>
                </div>
                <div class="tablecontainer">
                    <table class="tasktable">
                        { activeTodo.map((todo) => (
                            <tr key={ todo.id }>
                                <td class="taskcell">{ todo.title }</td>
                                <td class="datecell">{ new Date(todo.endTimestamp).toLocaleDateString('en-IN', {day: '2-digit', month: 'long', year: 'numeric', minimumIntegerDigits: 4 }) }</td>
                                <td class="timecell">{ new Date(todo.endTimestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/am|pm/i, (match) => match.toUpperCase()) }</td>
                                <td class="statuscell">
                                    {(todo.finished == true) ? (
                                        <button class="completedcontainer" onClick={() => taskBtnClick(todo)}>
                                            <label style={{color: "rgb(4, 255, 0)"}}>Completed</label>
                                        </button>
                                    ) : (new Date(todo.endTimestamp) > new Date()) ? (
                                        <button class="inprogresscontainer" onClick={() => taskBtnClick(todo)}>
                                            <label style={{color: "rgb(255, 170, 0)"}}>In Progress</label>
                                        </button>
                                    ) : (
                                        <button class="notcompletedcontainer" onClick={() => taskBtnClick(todo)}>
                                            <label style={{color: "rgb(190, 85, 255)"}}>Not Complete</label>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </body>
        </html>
    )}
    else {
        return (
            <div className="screen-loader-container">
                <div className="screen-loader"></div>
            </div>
        )
    }
}

export default CalendarPage;
