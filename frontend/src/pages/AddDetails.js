import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hostname from "./Host";
import '../styles/AddDetails.css'

function AddDetailsPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subtasks, setSubtasks] = useState({});
    const [subtask, setSubtask] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [starred, setStarred] = useState(false);
    const [userObj, setUserObj] = useState(null);
    const [error, setError] = useState(null);
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
        })
        .catch(error => {
            setError(error.message);
        });
    }, [navigate]);

    const addSubtaskBtn = (event) => {
        event.preventDefault();
        if (subtask === "") {
            return null;
        }
        const updatedSubtasks = {...subtasks, [subtask]: "0"};
        setSubtasks(updatedSubtasks);
        setSubtask('');
    }

    const dltSubtaskBtn = (task) => {

        const updatedSubtasks = {...subtasks};
        delete updatedSubtasks[task];
        setSubtasks(updatedSubtasks);
    }

    const starredBtn = (event) => {
        event.preventDefault();
        setStarred((starred == false)?true:false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(hostname + '/api/todo/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, subtasks: subtasks, endTimestamp: timestamp, userId: userObj.id, starred: starred, finished: false})
        })
        .then(response => {
            if (response.ok) {
                navigate({
                    pathname: '/'
                });
            }
            else {
                response.text().then((msg) => { setError(msg) });
            }
        })
        .catch(error => {
            setError(error.text)
        });
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        fetch(hostname + '/api/todo/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, subtasks: subtasks, endTimestamp: timestamp, userId: userObj.id, starred: starred, finished: false})
        })
        .then(response => {
            if (response.ok) {
                navigate({
                    pathname: '/'
                });
            }
            else {
                response.text().then((msg) => { setError(msg) });
            }
        })
        .catch(error => {
            setError(error.message);
        });
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

    if (userObj) {
        return (
            <html lang="en">
                <head>
                    <title>Add Task</title>
                    <link rel="stylesheet" href="addtask.css" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                </head>
                <body>
                    <div class="sidepane">
                        <div class="homebtncontainer">
                            <button class="adddetailshomebtn" onClick={ homeBtn }>
                                <i class="fa-solid fa-house"></i>
                            </button>
                        </div>
                        <div class="calendarbtncontainer">
                            <button class="adddetailscalendarbtn" onClick={ calendarBtn }>
                                <i class="fa-solid fa-calendar"></i>
                            </button>
                        </div>
                        <div class="addbtncontainer">
                            <button class="adddetailsaddbtn" onClick={ addTaskBtn }>
                                <i class="fa-solid fa-calendar-plus"></i>
                            </button>
                        </div>
                        <div class="starbtncontainer">
                            <button class="adddetailsstarbtn" onClick={ starBtn }>
                                <i class="fa-solid fa-star"></i>
                            </button>
                        </div>
                        <div class="logoutbtncontainer">
                            <button class="logoutbtn" onClick={ logoutBtn }>
                                <i class="fa-solid fa-right-from-bracket"></i>
                            </button>
                        </div>
                    </div>
                    <div class="adddetailsmaincontainer">
                        <form onSubmit={ handleFormSubmit }>
                            <div class="adddetailsformcontainer">
                                <div class="adddetailstitlecontainer">
                                    <span><i class="fa-solid fa-tag"></i></span>
                                    <input class="adddetailstitleinput" placeholder="Title" value={ title } onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                                <div class="adddetailsdesccontainer">
                                    <span><i class="fa-solid fa-align-left"></i></span>
                                    <textarea class="adddetailsdescinput" placeholder="Description" value={ description } onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                                <div class="adddetailssubtaskcontainer">
                                    <table class="adddetailssubtasktable">
                                        <tbody>
                                            { Object.entries(subtasks).map(([key, value]) => {
                                                return (
                                                <tr key={ key } style={{ padding:'0px' }}>
                                                    <td class="adddetailssubtasklabelcell" ><ul><li><label class="adddetailssubtasklabel">{ key }</label></li></ul></td>
                                                    <td class="adddetailssubtaskdltcell"><button class="adddetailssubtaskdlt" onClick={() => dltSubtaskBtn(key) }><i class="fa-sharp fa-solid fa-circle-xmark"></i></button></td>
                                            </tr>
                                                )
                                            }) }
                                        </tbody>
                                    </table>
                                        <div class="adddetailsfoot">
                                            <td class="adddetailssubtaskinputcell"><input type="text" class="adddetailssubtaskinput" placeholder="Subtask" value={ subtask } onChange={(e) => setSubtask(e.target.value)}/></td>
                                            <td class="adddetailssubtasksubmitcell"><button class="adddetailssubtasksubmit" onClick={ addSubtaskBtn }><i class="fa-solid fa-circle-check"></i></button></td>
                                        </div>
                                </div>
                                <div class="adddetailsdatetimecontainer">
                                    <span><i class="fa-solid fa-clock"></i></span>
                                    <input type="datetime-local" class="adddetailsdatetimeinput" placeholder="" value={ timestamp } onChange={(e) => setTimestamp(e.target.value)}/>
                                </div>
                                <div class="adddetailsstarcontainer">
                                    <button class="adddetailsstarbutton" onClick={ starredBtn }><i class="fa-solid fa-star" style={{color: (starred == false)?"white":"yellow"}} onMouseEnter={(e) => {e.target.style.color = (starred == false)?"yellow":"white"}} onMouseLeave={(e) => {e.target.style.color = (starred == false)?"white":"yellow"}}></i></button>
                                </div>
                                { error && <div class="adddetailserrcontainer">{ error } !</div>}
                                <div class="adddetailssubmitbtncontainer">
                                    <button class="adddetailssubmitbtn" onClick={ handleSubmit }><i class="fa-regular fa-calendar-plus"></i></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </body>
            </html>
        )
    }
    else {
        return (
            <div className="screen-loader-container">
                <div className="screen-loader"></div>
            </div>
        )
    }
}

export default AddDetailsPage;