import { Schema, model, Types } from 'mongoose';

const studentSchema = new Schema({
  coachId: { type: Types.ObjectId, ref: 'Coach', required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String }
}, { timestamps: true });

export const Student = model('Student', studentSchema);
