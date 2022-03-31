const express = require('express');
require('dotenv').config();

const app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport');

const bodyPareser = require('body-parser');
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');
const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');
const { connectToMongo } = require('./db/connection');
const logger = require('./services/logger');
require('./util/passport');

const port = process.env.NODE_LOCAL_PORT || 3000;
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use(bodyPareser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views/components`);
app.set('views', `${__dirname}/views/assets/components`);
app.use(express.static(`${__dirname}/views/assets`));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  connectToMongo();
});
module.exports = server;
