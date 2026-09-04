// for postgresql
// require('dotenv').config();
// const express = require('express');
// const { Pool } = require('pg');

// const app = express();
// app.use(express.json());

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Test route
// app.get('/', (req, res) => {
//   res.send('Habit Tracker API is running');
// });

// // Create a user
// app.post('/users', async (req, res) => {
//   const { email, password_hash } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
//       [email, password_hash]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create a habit
// app.post('/habits', async (req, res) => {
//   const { user_id, name, frequency } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO habits (user_id, name, frequency) VALUES ($1, $2, $3) RETURNING *',
//       [user_id, name, frequency || 'daily']
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Log a habit check-in
// app.post('/habit-logs', async (req, res) => {
//   const { habit_id, note } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO habit_logs (habit_id, note) VALUES ($1, $2) RETURNING *',
//       [habit_id, note || null]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all habits for a user, with their logs
// app.get('/habits/:user_id', async (req, res) => {
//   const { user_id } = req.params;
//   try {
//     const result = await pool.query(
//       `SELECT 
//          habits.id AS habit_id,
//          habits.name,
//          habits.frequency,
//          habit_logs.id AS log_id,
//          habit_logs.completed_at,
//          habit_logs.note
//        FROM habits
//        LEFT JOIN habit_logs ON habit_logs.habit_id = habits.id
//        WHERE habits.user_id = $1
//        ORDER BY habits.id, habit_logs.completed_at DESC`,
//       [user_id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.DB_PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// for prisma 
require('dotenv').config();
const express = require('express');

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(express.json());


// Test route
app.get('/', (req, res) => {
  res.send('Habit Tracker API is running');
});

// Create a user
app.post('/users', async (req, res) => {
  const { email, password_hash } = req.body;
  try {
    const user = await prisma.users.create({
      data: { email, password_hash },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a habit
app.post('/habits', async (req, res) => {
  const { user_id, name, frequency } = req.body;
  try {
    const habit = await prisma.habits.create({
      data: {
        name,
        frequency: frequency || 'daily',
        users: { connect: { id: user_id } },
      },
    });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log a habit check-in
app.post('/habit-logs', async (req, res) => {
  const { habit_id, note } = req.body;
  try {
    const log = await prisma.habit_logs.create({
      data: {
        note: note || null,
        habits: { connect: { id: habit_id } },
      },
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all habits for a user, with their logs
app.get('/habits/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const habits = await prisma.habits.findMany({
      where: { user_id: Number(user_id) },
      include: {
        habit_logs: {
          orderBy: { completed_at: 'desc' },
        },
      },
    });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
