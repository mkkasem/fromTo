const express = require('express');
require('dotenv').config();

const app = express();
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');
const authRouter = require('./routers/auth');

const { connectToMongo } = require('./db/connection');

const port = process.env.NODE_LOCAL_PORT || 3000;
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.listen(port, () => {
  console.log('app listening on port 3000!');
  connectToMongo();
});
