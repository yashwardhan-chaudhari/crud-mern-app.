// ─── Global Error Handling Middleware ────────────────────────────────────────
// CRITICAL: Must have exactly 4 parameters for Express to recognize as error middleware
// Express identifies error handlers by the (err, req, res, next) signature

const errorHandler = (err, req, res, next) => {
  // Log full error details for developers (never shown to users)
  console.error(`[ERROR] ${req.method} ${req.url} →`, {
    message: err.message,
    status: err.status || err.statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Use status attached to error, or default to 500
  const status = err.status || err.statusCode || 500;

  // Always return CONSISTENT format: { success: false, message: "..." }
  // This is what the frontend relies on to display error messages
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;
