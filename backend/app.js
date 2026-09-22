require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Import Routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const manifestRouter = require('./routes/manifest');
const inspectionRouter = require('./routes/inspection');

const app = express();

// Middleware Middle Tier Setup
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes Setup
app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/manifest', manifestRouter);
app.use('/api/inspection', inspectionRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = app;
