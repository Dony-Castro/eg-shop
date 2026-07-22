const env = require('../config/env');

const errorHandler = (error, req, res, _next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';
  const errors = error.errors || [];

  if (env.nodeEnv !== 'production') {
    console.error(error);
  }

  if (req.path.startsWith('/api/')) {
    return res.status(status).json({
      success: false,
      message,
      errors
    });
  }

  return res.status(status).render('error', {
    title: 'Error',
    status,
    message
  });
};

module.exports = errorHandler;
