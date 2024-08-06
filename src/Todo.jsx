import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import noTasksImage from './assets/no-task.png';
import noFinishedTasksImage from './assets/no-finished-tasks.png';
import noActiveTasksImage from './assets/no-active-tasks.png';

function Todo() {
    const [todo, setTodo] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [editId, setEditId] = useState(0);
    const [filter, setFilter] = useState("All");
    const [activeCount, setActiveCount] = useState(0);
    const [finishedCount, setFinishedCount] = useState(0);
    const [showModal, setShowModal] = useState(false); // Modal visibility state

    useEffect(() => {
        document.title = "My Todo App";
    }, []);

    const handleChange = (e) => {
        setTodo(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (todo === "" || date === "" || time === "") {
            window.alert("Please fill out all fields");
            return;
        }
        if (editId) {
            const editTodo = todos.find((i) => i.id === editId);
            const updatedTodos = todos.map((t) =>
                t.id === editTodo.id ? { ...t, todo, date, time } : t
            );
            setTodos(updatedTodos);
            setEditId(0);
            setTodo("");
            setDate("");
            setTime("");
            setShowModal(false); // Close modal after editing
        } else {
            const now = new Date();
            const timestamp = now.toLocaleString();
            setTodos([...todos, { id: `${todo}-${Date.now()}`, todo, date, time, timestamp, completed: false }]);
            setTodo("");
            setDate("");
            setTime("");
        }
    };

    const deleteHandler = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (confirmDelete) {
            const delTodo = todos.filter((to) => to.id !== id);
            setTodos(delTodo);
        }
    };

    const editHandler = (id) => {
        const editTodo = todos.find((i) => i.id === id);
        setTodo(editTodo.todo);
        setDate(editTodo.date);
        setTime(editTodo.time);
        setEditId(id);
        setShowModal(true); // Show modal on edit
    };

    const toggleComplete = (id) => {
        const updatedTodos = todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTodos(updatedTodos);
    };

    const deleteCompleted = () => {
        const completedTasks = todos.filter(t => t.completed);
        if (completedTasks.length === 0) {
            alert("No tasks are done yet.");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete all completed tasks?");
        if (confirmDelete) {
            const filteredTodos = todos.filter(t => !t.completed);
            setTodos(filteredTodos);
        }
    };

    const selectAll = () => {
        const updatedTodos = todos.map((t) => ({ ...t, completed: true }));
        setTodos(updatedTodos);
    };

    const unselectAll = () => {
        const completedTasks = todos.filter(t => t.completed);
        if (completedTasks.length === 0) {
            alert("There are no finished tasks yet.");
            return;
        }
        const updatedTodos = todos.map((t) => ({ ...t, completed: false }));
        setTodos(updatedTodos);
    };

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        const activeTasks = todos.filter(t => !t.completed).length;
        const finishedTasks = todos.filter(t => t.completed).length;

        setActiveCount(activeTasks);
        setFinishedCount(finishedTasks);
    }, [filter, todos]);

    const filteredTodos = todos.filter(t => {
        if (filter === "All") return true;
        if (filter === "Active") return !t.completed;
        if (filter === "Finished") return t.completed;
        return true;
    });

    return (
        <>
            <div className='container text-center todo-container'>
                <h1 className='text-light mt-3'>To Do App</h1>
                <form onSubmit={handleSubmit} className='form-inline'>
                    <div className='form-group'>
                        <input
                            className='enterTodo form-control mt-3'
                            type="text"
                            placeholder='Enter To do...'
                            onChange={handleChange}
                            value={todo}
                        />
                        <div className='date-time-container mt-3'>
                            <input
                                className='enterDate form-control dateCustom'
                                type="date"
                                onChange={handleDateChange}
                                value={date}
                            />
                            <input
                                className='enterTime form-control ml-2 timeCustom'
                                type="time"
                                onChange={handleTimeChange}
                                value={time}
                            />
                        </div>
                        <button className='btn btn-custom mt-2 ml-2'>
                            {editId ? "Update Todo" : "Add Todo"}
                        </button>
                    </div>
                </form>

                {todos.length > 0 && (
                    <div className="container text-center mt-3 filterButtons">
                        <button className='btn btn-custom mx-1' onClick={() => { setFilter("All"); setActiveCount(todos.filter(t => !t.completed).length); setFinishedCount(todos.filter(t => t.completed).length); }}>
                            All
                        </button>
                        <button className='btn btn-custom mx-1' onClick={() => setFilter("Active")}>
                            Pending ({activeCount})
                        </button>
                        <button className='btn btn-custom mx-1' onClick={() => setFilter("Finished")}>
                            Finished ({finishedCount})
                        </button>
                    </div>
                )}

                {todos.length === 0 && (
                    <div className="no-tasks">
                        <img src={noTasksImage} alt="No tasks available" className="img-fluid mt-4" />
                    </div>
                )}

                {filter === "Finished" && finishedCount === 0 && todos.length > 0 && (
                    <div className="no-tasks">
                        <img src={noFinishedTasksImage} alt="No finished tasks" className="img-fluid mt-4" style={{ maxWidth: '400px', maxHeight: '400px' }} />
                    </div>
                )}

                {filter === "Active" && activeCount === 0 && todos.length > 0 && (
                    <div className="no-tasks">
                        <img src={noActiveTasksImage} alt="No active tasks" className="img-fluid mt-4" style={{ maxWidth: '400px', maxHeight: '400px' }} />
                    </div>
                )}

                <div>
                    {filteredTodos.map((t) => (
                        <div className="container bg-light border mt-2 display" key={t.id}>
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    checked={t.completed}
                                    onChange={() => toggleComplete(t.id)}
                                    className="mr-2"
                                />
                                <div className="todo-info">
                                    <p className={`todo ${t.completed ? 'completed' : ''}`}>
                                        {t.todo}
                                    </p>
                                    <small className="text-muted small-text">
                                        Created on: {t.timestamp}
                                    </small>
                                    <small className="text-muted small-text">
                                        Due: {t.date} {t.time}
                                    </small>
                                </div>
                            </div>
                            <div className="delEditButtons">
                                <button className="btn btn-primary editButton"
                                    onClick={() => editHandler(t.id)}
                                >
                                    EDIT
                                </button>
                                <button className="btn btn-danger mx-2 deleteButton"
                                    onClick={() => deleteHandler(t.id)}
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {todos.length > 0 && (
                    <div className='container text-center mt-3 filterButtons'>
                        <button className='btn btn-custom mx-1' onClick={selectAll} type="button">
                            Mark All Done
                        </button>
                        <button className='btn btn-custom mx-1' onClick={unselectAll} type="button">
                            Mark All Undone
                        </button>
                        <button className='btn btn-danger mx-1' onClick={deleteCompleted} type="button">
                            Delete All
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: '#9D71BC', color: '#fff' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Task</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)} style={{ marginLeft: 'auto' }}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Task</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={todo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={date}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={time}
                                            onChange={handleTimeChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn mt-3" style={{ backgroundColor: '#5e1b89', color: '#fff' }}>
                                        Save changes
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Todo;
