import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import User from '../models/User.js';

function requireJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Server missing JWT_SECRET in .env');
  }
  return secret;
}

function buildAuthPayload(user) {
  const secret = requireJwtSecret();
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
    expiresIn: '7d',
  });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    },
  };
}

export async function handleSignup(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.create({
      email,
      password,
      name: name?.trim() || null,
    });

    const { token, user: safeUser } = buildAuthPayload(user);

    res.status(201).json({
      success: true,
      userId: user.id,
      token,
      user: safeUser,
    });
  } catch (error) {
    if (error.message?.includes('JWT_SECRET')) {
      return res.status(500).json({ error: error.message });
    }
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ error: 'That email is already registered' });
    }
    if (error instanceof ValidationError) {
      const msg = error.errors?.[0]?.message || 'Validation failed';
      return res.status(400).json({ error: msg });
    }
    const status =
      error.message?.includes('Invalid') || error.message?.includes('Password')
        ? 400
        : 500;
    res.status(status).json({ error: error.message });
  }
}

export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(String(password), user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { token, user: safeUser } = buildAuthPayload(user);

    res.json({
      token,
      user: safeUser,
    });
  } catch (error) {
    if (error.message?.includes('JWT_SECRET')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}
