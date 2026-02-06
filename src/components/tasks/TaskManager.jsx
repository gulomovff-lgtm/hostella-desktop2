import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { inputClass } from '../../config/constants';

const TaskManager = ({ tasks = [], onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState('');
  
  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(newTask);
      setNewTask('');
    }
  };
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Задачи</h2>
      
      <Card title="Добавить задачу">
        <div className="flex gap-3">
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdd()} className={inputClass} placeholder="Описание задачи..." />
          <Button onClick={handleAdd}>Добавить</Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={`Активные (${pendingTasks.length})`}>
          <div className="space-y-2">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input type="checkbox" checked={false} onChange={() => onToggleTask(task.id)} className="w-5 h-5" />
                <span className="flex-1">{task.text}</span>
                <button onClick={() => onDeleteTask(task.id)} className="text-red-500 hover:text-red-700">🗑️</button>
              </div>
            ))}
            {pendingTasks.length === 0 && <p className="text-slate-400 text-center py-4">Нет активных задач</p>}
          </div>
        </Card>
        
        <Card title={`Выполненные (${completedTasks.length})`}>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <input type="checkbox" checked={true} onChange={() => onToggleTask(task.id)} className="w-5 h-5" />
                <span className="flex-1 line-through text-slate-500">{task.text}</span>
                <button onClick={() => onDeleteTask(task.id)} className="text-red-500 hover:text-red-700">🗑️</button>
              </div>
            ))}
            {completedTasks.length === 0 && <p className="text-slate-400 text-center py-4">Нет выполненных задач</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaskManager;
