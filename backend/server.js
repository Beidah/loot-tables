const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

require('dotenv').config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// If the user sends a auth token, log them in
const { logUserIn } = require('./middleware/auth');
app.use(logUserIn);

const userRouter = require('./routes/userRouter');
const tableRouter = require('./routes/tableRouter');

app.use('/api/users', userRouter);
app.use('/api/tables', tableRouter);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')));
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use((err, _req, res, _next) => {
  let { status = 500, message } = err;

  res.status(status).json({ message });
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});