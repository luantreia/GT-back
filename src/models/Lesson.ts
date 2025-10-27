import { Schema, model, Types } from 'mongoose';

const lessonSchema = new Schema({
  coachId: { type: Types.ObjectId, ref: 'Coach', required: true, index: true },
  studentId: { type: Types.ObjectId, ref: 'Student', required: true },
  start: { type: Date, required: true, index: true },
  end: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' },
  notes: { type: String }
}, { timestamps: true });

lessonSchema.index({ coachId: 1, start: 1 });

export const Lesson = model('Lesson', lessonSchema);
