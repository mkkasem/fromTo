const express = require('express');
require('dotenv').config();

const app = express();
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');
const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');

const { connectToMongo } = require('./db/connection');
const logger = require('./services/logger');

const port = process.env.NODE_LOCAL_PORT || 3000;
app.use(express.json());

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  connectToMongo();
});
module.exports = server;
