const notFound = (req, res, _next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'Recurso no encontrado',
      errors: []
    });
  }

  return res.status(404).render('not-found', { title: 'Página no encontrada' });
};

module.exports = notFound;
