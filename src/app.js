const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');

const bodyPareser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');
const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');
const { connectToMongo } = require('./db/connection');
const logger = require('./services/logger');
require('./util/passport');
require('ejs');

const port = process.env.NODE_LOCAL_PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(passport.initialize());
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.set('images', `${__dirname}/images`);

app.use(express.static(path.join(__dirname, 'views/js')));
// app.use(express.static(`${__dirname}/views/Bizland`));
// app.use(express.static(path.join(__dirname, 'js')));

app.use(methodOverride('_method'));
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
