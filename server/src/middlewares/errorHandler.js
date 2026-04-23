export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`)

  if (err.code === 'P2002') {
    return res.status(409).json({
      message: `Value already exists (${err.meta?.target?.join(', ')})`,
    })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found' })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}