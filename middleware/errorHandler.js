/**
 * Central error handling — keep route handlers thin by forwarding errors with `next(err)`.
 */
export function notFound(req, res) {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err?.message === 'Only image files allowed') {
    return res.status(400).json({ error: err.message });
  }

  if (err?.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large' });
  }

  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}
