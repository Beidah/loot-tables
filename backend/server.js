const express = require('express');
const connectDB = require('./config/db');

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

// 404 catch all
app.use((req, res) => {
  console.log(req);
  res.status(404).json({ message: `route '${req.originalUrl}' not found` });
})

app.use((err, _req, res, _next) => {
  let { status = 500, message } = err;

  res.status(status).json({ message });
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});