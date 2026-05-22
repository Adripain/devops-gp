const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const { metricsMiddleware, register, tasksCreated } = require('./metrics');

const allowedStatuses = ['todo', 'in_progress', 'done'];

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(metricsMiddleware);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/metrics', async (_req, res, next) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/tasks', async (_req, res, next) => {
    try {
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC, id DESC');
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/tasks/:id', async (req, res, next) => {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json(result.rows[0]);
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/tasks', async (req, res, next) => {
    try {
      const { title, description = '', status = 'todo' } = req.body;
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await pool.query(
        'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
        [title.trim(), description, status]
      );
      tasksCreated.inc();
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      return next(error);
    }
  });

  app.put('/api/tasks/:id', async (req, res, next) => {
    try {
      const { title, description = '', status = 'todo' } = req.body;
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await pool.query(
        `UPDATE tasks
         SET title = $1, description = $2, status = $3
         WHERE id = $4
         RETURNING *`,
        [title.trim(), description, status, req.params.id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json(result.rows[0]);
    } catch (error) {
      return next(error);
    }
  });

  app.delete('/api/tasks/:id', async (req, res, next) => {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
