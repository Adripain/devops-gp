import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, Circle, Clock3, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from './api';
import './styles.css';

const emptyForm = { title: '', description: '', status: 'todo' };
const statuses = [
  { value: 'todo', label: 'To do', icon: Circle },
  { value: 'in_progress', label: 'In progress', icon: Clock3 },
  { value: 'done', label: 'Done', icon: CheckCircle2 }
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTasks() {
    setError('');
    const data = await api.listTasks();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status.value] = tasks.filter((task) => task.status === status.value).length;
      return acc;
    }, {});
  }, [tasks]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.updateTask(editingId, form);
      } else {
        await api.createTask(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status
    });
  }

  async function removeTask(id) {
    setError('');
    try {
      await api.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="header-row">
          <div>
            <p className="eyebrow">DevOps demo</p>
            <h1>Task Manager</h1>
          </div>
          <div className="stats" aria-label="Task status summary">
            {statuses.map((status) => {
              const Icon = status.icon;
              return (
                <div className="stat" key={status.value}>
                  <Icon size={18} />
                  <span>{status.label}</span>
                  <strong>{counts[status.value] || 0}</strong>
                </div>
              );
            })}
          </div>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Ship the demo"
              required
              maxLength="200"
            />
          </label>
          <label>
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Short context for the team"
              rows="3"
            />
          </label>
          <label>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              {statuses.map((status) => (
                <option value={status.value} key={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">
              {editingId ? <Pencil size={18} /> : <Plus size={18} />}
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                className="secondary"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                aria-label="Cancel editing"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="alert">{error}</p>}

        <section className="task-list" aria-live="polite">
          {loading && <p className="empty">Loading tasks...</p>}
          {!loading && tasks.length === 0 && <p className="empty">No tasks yet.</p>}
          {tasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div>
                <div className="task-title-row">
                  <h2>{task.title}</h2>
                  <span className={`badge ${task.status}`}>{labelFor(task.status)}</span>
                </div>
                <p>{task.description || 'No description'}</p>
                <time dateTime={task.created_at}>
                  Created {new Date(task.created_at).toLocaleString()}
                </time>
              </div>
              <div className="task-actions">
                <button type="button" onClick={() => startEdit(task)} aria-label={`Edit ${task.title}`}>
                  <Pencil size={18} />
                </button>
                <button type="button" onClick={() => removeTask(task.id)} aria-label={`Delete ${task.title}`}>
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function labelFor(value) {
  return statuses.find((status) => status.value === value)?.label || value;
}

createRoot(document.getElementById('root')).render(<App />);
