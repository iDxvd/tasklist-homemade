const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const Task = require('./modules/task.js'); // Importing the task model
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

app.use(cors()); // Enable CORS for all routes

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


// This tells your app to accept JSON in requests
app.use(express.json());


// Route for homepage
app.get('/', (req, res) => {
  res.send('Your API is working!');
});

// Route to get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Route to add a new task
app.post('/tasks', async (req, res) => {
  const newTask = new Task({
    title: req.body.title
  });

  await newTask.save();
  res.status(201).json(newTask);
});


// Route to delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Task not found' });
  res.json(deleted);
});

// Route to update a task by ID
app.put('/tasks/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      completed: req.body.completed
    },
    { new: true } // return the updated task
  );

  if (!updated) return res.status(404).json({ message: 'Task not found' });
  res.json(updated);
});

// Start server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
