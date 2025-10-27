import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Coach } from '../models/Coach.js';
import { registerSchema, loginSchema } from '../utils/validate.js';
import { env } from '../config/env.js';

const router = Router();

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, name, phone } = parsed.data;

  const existing = await Coach.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email ya registrado' });

  const passwordHash = await bcrypt.hash(password, 10);
  const coach = await Coach.create({ email, passwordHash, name, phone });

  const token = jwt.sign({ userId: coach._id.toString() }, env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, coach: { id: coach._id, email: coach.email, name: coach.name, phone: coach.phone } });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const coach = await Coach.findOne({ email });
  if (!coach) return res.status(401).json({ error: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, coach.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ userId: coach._id.toString() }, env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, coach: { id: coach._id, email: coach.email, name: coach.name, phone: coach.phone } });
});

export default router;
