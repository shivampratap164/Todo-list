import React, { useReducer, useState } from 'react';
import './ToDoList.css';

const initialState = {
  tasks: [],
};


function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: Date.now(), text: action.payload, completed: false },
        ],
      };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, text: action.payload.text }
            : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    default:
      return state;
  }
}

const ToDoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [taskInput, setTaskInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const addTask = () => {
    if (taskInput.trim() === '') return;
    if (editMode) {
      dispatch({
        type: 'EDIT_TASK',
        payload: { id: editId, text: taskInput },
      });
      setEditMode(false);
      setEditId(null);
    } else {
      dispatch({ type: 'ADD_TASK', payload: taskInput });
    }
    setTaskInput('');
  };

  const handleEdit = (task) => {
    setEditMode(true);
    setEditId(task.id);
    setTaskInput(task.text);
  };

  const handleComplete = (id) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  return (
    <div>
      <h2>ToDo List</h2>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Add a task"
      />
      <button onClick={addTask}>{editMode ? 'Update' : 'Add'}</button>

      {state.tasks.length > 0 && (
        <table border="1" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Task</th>
              <th>Edit</th>
              <th>Complete/Delete</th>
            </tr>
          </thead>
          <tbody>
            {state.tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.text}
                </td>
                <td>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleComplete(task.id)}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ToDoList;
