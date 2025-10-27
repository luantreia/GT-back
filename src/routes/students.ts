import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { Student } from '../models/Student.js';
import { studentCreateSchema, studentUpdateSchema } from '../utils/validate.js';

const router = Router();

router.use(auth);

router.get('/', async (req, res) => {
  const students = await Student.find({ coachId: req.userId }).sort({ name: 1 });
  res.json(students.map((s: any) => ({ id: s._id, name: s.name, phone: s.phone, email: s.email })));
});

router.post('/', async (req, res) => {
  const parsed = studentCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const s = await Student.create({ coachId: req.userId, ...parsed.data });
  res.status(201).json({ id: s._id, name: s.name, phone: s.phone, email: s.email });
});

router.patch('/:id', async (req, res) => {
  const parsed = studentUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  await Student.updateOne({ _id: req.params.id, coachId: req.userId }, { $set: parsed.data });
  res.status(204).send();
});

router.delete('/:id', async (req, res) => {
  await Student.deleteOne({ _id: req.params.id, coachId: req.userId });
  res.status(204).send();
});

export default router;
