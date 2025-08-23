import React, { useEffect, useState } from 'react';
import './ToDo.css';

function ToDo() {
  const [task, setTask] = useState('');
  const [todoData, setTodoData] = useState([]);

  async function handleFetch() {
    const fetchedDataFromTheServer = await fetchFromServer();
    console.log(fetchedDataFromTheServer);
    setTodoData(fetchedDataFromTheServer);
  }

  async function handlePost() {
    const postedData = await postToTheServer(task, false);
    handleFetch();
  }

  async function handlePatchCompleteStatus(id, completed) {
    const editedData = await editFromTheServer(id, completed);
    handleFetch();
  }

  async function handleDelete(id) {
    const delData = await deleteFromTheServer(id, deleteFromTheServer);
    handleFetch();
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>To Do</h1>
      </div>
      <div className="todo-body">
        <div className="add-todo">
          <form
            onSubmit={e => {
              e.preventDefault();
              handlePost();
              setTask('');
            }}
          >
            <label htmlFor="todo">Todo:</label>
            <input
              required
              minLength={2}
              type="text"
              id="todo"
              value={task}
              onChange={e => setTask(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
        <div className="todo-display">
          {todoData.map(e => (
            <DisplayToDo
              key={e.id}
              task={e}
              handlePatchCompleteStatus={handlePatchCompleteStatus}
              handleDelete={handleDelete}
            ></DisplayToDo>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ToDo;

async function postToTheServer(task, completed) {
  const url = 'http://127.0.0.1:8090/api/collections/todo/records';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task,
        completed,
      }),
    });
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function fetchFromServer() {
  try {
    const url = 'http://127.0.0.1:8090/api/collections/todo/records';
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.items);
    return data.items;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function editFromTheServer(id, completed) {
  const url = `http://127.0.0.1:8090/api/collections/todo/records/${id}`;
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !completed,
      }),
    });
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function deleteFromTheServer(id) {
  const url = `http://127.0.0.1:8090/api/collections/todo/records/${id}`;
  try {
    const res = await fetch(url, { method: 'DELETE' });
  } catch (error) {}
}
// Display to do:

function DisplayToDo({ task, handlePatchCompleteStatus, handleDelete }) {
  console.log(task);
  const cN = `todoactual ${task.completed ? 'completedlt' : 'none'}`;
  return (
    <div className="todo">
      <div className={cN}>{task.task}</div>
      <button className="edit">Edit</button>
      <button className="delete" onClick={() => handleDelete(task.id)}>
        Delete
      </button>
      <button
        className={task.completed ? 'completedlt' : 'completed'}
        onClick={() => handlePatchCompleteStatus(task.id, task.completed)}
      >
        {task.completed ? 'Undo' : 'Completed'}
      </button>
    </div>
  );
}
