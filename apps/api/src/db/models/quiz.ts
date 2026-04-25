import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const QuestionSchema = new Schema(
  {
    type: { type: String, enum: ['mcq', 'multi', 'code-output', 'short'], required: true },
    prompt: { type: String, required: true },
    choices: { type: [String], default: undefined },
    correct: { type: Schema.Types.Mixed, required: true }, // number[] or string
    explanation: { type: String, default: '' },
    points: { type: Number, default: 10 },
  },
  { _id: false },
);

const QuizSchema = new Schema(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, unique: true, index: true },
    title: { type: String, required: true },
    questions: { type: [QuestionSchema], default: [] },
    timeLimitSec: { type: Number, default: null },
    passingPct: { type: Number, default: 70 },
  },
  { timestamps: true },
);

export type QuizDoc = InferSchemaType<typeof QuizSchema> & { _id: Types.ObjectId };
export const Quiz = model('Quiz', QuizSchema);
