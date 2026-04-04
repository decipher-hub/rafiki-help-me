import jwt from 'jsonwebtoken';

/**
 * Expects header: Authorization: Bearer <token>
 * Attaches req.user = { userId, email }
 */
export function requireLogin(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Login required' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server missing JWT_SECRET' });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
