import React from 'react';

const TaskList = ({ tasks, removeTask }) => {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.text}>
          <span className={task.completed ? 'complete' : null}>
            {task.text}
          </span>
          <button onClick={() => removeTask(task)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
