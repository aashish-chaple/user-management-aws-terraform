export const validateJsonContentType = (req, res, next) => {
    if (req.headers['content-type'] !== 'application/json') {
      return res.status(415).json({ error: "Unsupported Media Type" });
    }
    next(); // Proceed to the next middleware/handler if valid
  };