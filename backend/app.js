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
const statsRouter = require('./routes/stats');
const usersRouter = require('./routes/users');
const logsRouter = require('./routes/logs');
const ocrRouter = require('./routes/ocr');

const app = express();

// Middleware Middle Tier Setup
app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes Setup
app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/manifest', manifestRouter);
app.use('/api/inspection', inspectionRouter);
app.use('/api/stats', statsRouter);
app.use('/api/users', usersRouter);
app.use('/api/logs', logsRouter);
app.use('/api/ocr', ocrRouter);

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
