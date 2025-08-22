import React, { useEffect, useState } from 'react';
import './ToDo.css';

function ToDo() {
  const [task, setTask] = useState('');
  const [todoData, setTodoData] = useState([]);

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
              upDateToTheServer(task, 'false', setTodoData);
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
            <DisplayToDo key={e.id} task={e.task}></DisplayToDo>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ToDo;

async function upDateToTheServer(task, completed, setTodoData) {
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
    const latestData = await fetchFromServer();
    console.log(latestData);
    setTodoData(latestData);
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

function DisplayToDo({ task }) {
  return (
    <div className="todo">
      <div className="todoactual">{task}</div>
      <button className="edit">Edit</button>
      <button className="delete">Delete</button>
      <button className="completed">Completed</button>
    </div>
  );
}
