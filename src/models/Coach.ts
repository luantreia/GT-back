import { Schema, model } from 'mongoose';

const coachSchema = new Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String }
}, { timestamps: true });

export const Coach = model('Coach', coachSchema);
