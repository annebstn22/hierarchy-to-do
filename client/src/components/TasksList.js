// TasksList.js
import React from 'react';

const TaskList = ({ tasks }) => {
  return (
    <div>
        <ul>
        {tasks.map((task,i) => (
            <li key={task.task_id}>
            {i+1}. 
            {task.done ? ' (Completed)' : ''}
            {task.task_title}
            {task.children && task.children.length > 0 && (
            <TaskList tasks={task.children} />
          )}
            </li>
        ))}
        </ul>
    </div>
  );
};

export default TaskList;
