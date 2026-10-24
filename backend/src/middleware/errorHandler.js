function errorHandler(err, req, res, next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Ukuran foto maksimal 2MB' });
  }

  if (err.message && err.message.includes('Hanya diperbolehkan format')) {
    return res.status(400).json({ error: err.message });
  }

  console.error('[Unhandled Error]', err);
  return res.status(err.status || 500).json({
    error: err.message || 'Terjadi kesalahan internal pada server'
  });
}

module.exports = errorHandler;
