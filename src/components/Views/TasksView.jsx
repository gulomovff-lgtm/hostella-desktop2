import React from 'react';
import TaskManager from '../tasks/TaskManager';

/**
 * Tasks View Component
 * Wrapper for TaskManager component
 */
const TasksView = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  return (
    <TaskManager
      tasks={tasks}
      onAddTask={onAddTask}
      onToggleTask={onToggleTask}
      onDeleteTask={onDeleteTask}
    />
  );
};

export { TasksView };
export default TasksView;
