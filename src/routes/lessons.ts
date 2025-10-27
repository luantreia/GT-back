import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { Lesson } from '../models/Lesson.js';
import { lessonCreateSchema, lessonUpdateSchema } from '../utils/validate.js';
import { env } from '../config/env.js';
import { toUTC } from '../utils/date.js';

const router = Router();

router.use(auth);

router.get('/', async (req, res) => {
  const { from, to } = req.query as { from?: string; to?: string };
  const q: any = { coachId: req.userId };
  if (from && to) {
    q.start = { $gte: new Date(from) };
    q.end = { $lte: new Date(to) };
  }
  const lessons = await Lesson.find(q).populate('studentId', 'name email phone').sort({ start: 1 });
  res.json(lessons.map((l: any) => ({
    id: l._id,
    student: l.get('studentId'),
    start: l.start,
    end: l.end,
    status: l.status,
    notes: l.notes
  })));
});

async function hasConflict(coachId: string, start: Date, end: Date, excludeId?: string) {
  const query: any = {
    coachId,
    $or: [
      { start: { $lt: end }, end: { $gt: start } }
    ]
  };
  if (excludeId) query._id = { $ne: excludeId };
  const count = await Lesson.countDocuments(query);
  return count > 0;
}

router.post('/', async (req, res) => {
  const parsed = lessonCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const start = toUTC(parsed.data.start, env.TZ);
  const end = toUTC(parsed.data.end, env.TZ);
  if (await hasConflict(req.userId!, start, end)) return res.status(409).json({ error: 'Conflicto de horario' });

  const l = await Lesson.create({ coachId: req.userId, studentId: parsed.data.studentId, start, end, notes: parsed.data.notes });
  res.status(201).json({ id: l._id });
});

router.patch('/:id', async (req, res) => {
  const parsed = lessonUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data: any = {};
  if (parsed.data.start) data.start = toUTC(parsed.data.start, env.TZ);
  if (parsed.data.end) data.end = toUTC(parsed.data.end, env.TZ);
  if (parsed.data.status) data.status = parsed.data.status;
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;

  if (data.start || data.end) {
    const lesson = await Lesson.findOne({ _id: req.params.id, coachId: req.userId });
    if (!lesson) return res.status(404).json({ error: 'Clase no encontrada' });
    const start = data.start ?? lesson.start;
    const end = data.end ?? lesson.end;
    if (await hasConflict(req.userId!, start, end, lesson._id.toString())) return res.status(409).json({ error: 'Conflicto de horario' });
  }

  await Lesson.updateOne({ _id: req.params.id, coachId: req.userId }, { $set: data });
  res.status(204).send();
});

router.delete('/:id', async (req, res) => {
  await Lesson.deleteOne({ _id: req.params.id, coachId: req.userId });
  res.status(204).send();
});

export default router;
