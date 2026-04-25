import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const ProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'in-progress' },
    sectionsCompleted: { type: [String], default: [] },
    quizBestPct: { type: Number, default: null },
    timeSpentSec: { type: Number, default: 0 },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export type ProgressDoc = InferSchemaType<typeof ProgressSchema> & { _id: Types.ObjectId };
export const Progress = model('Progress', ProgressSchema);
