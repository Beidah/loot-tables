const express = require('express');

require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRouter = require('./routes/userRouter');

app.use('/api/users', userRouter);

app.use((err, _req, res, _next) => {
  let { status = 500, message } = err;

  res.status(status).json({ message });
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});