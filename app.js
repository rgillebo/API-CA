var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var swaggerFile = require('./swagger_output.json');
require('dotenv').config();

// Import routers
var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos');
var categoriesRouter = require('./routes/categories');
var statusesRouter = require('./routes/statuses');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve Swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Use routes
app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/categories', categoriesRouter);
app.use('/statuses', statusesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;