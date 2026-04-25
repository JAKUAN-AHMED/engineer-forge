import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const DryRunStepSchema = new Schema(
  {
    code: String,
    callStack: [String],
    microtaskQueue: [String],
    macrotaskQueue: [String],
    heap: Schema.Types.Mixed,
    explanation: String,
  },
  { _id: false },
);

const InterviewQSchema = new Schema(
  {
    company: String,
    prompt: String,
    answer: String,
    difficulty: { type: Number, min: 1, max: 3 },
  },
  { _id: false },
);

const ProblemRefSchema = new Schema(
  {
    slug: String,
    title: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  },
  { _id: false },
);

const SectionsSchema = new Schema(
  {
    simpleExplanation: { body: String },
    visual: { body: String, diagramUrl: String },
    deepBreakdown: { body: String },
    dryRun: { body: String, steps: [DryRunStepSchema] },
    commonMistakes: { body: String },
    interviewQuestions: { items: [InterviewQSchema] },
    practiceProblems: { items: [ProblemRefSchema] },
    thinkLikeEngineer: { body: String },
  },
  { _id: false },
);

const LessonSchema = new Schema(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    estimatedMinutes: { type: Number, default: 30 },
    xpReward: { type: Number, default: 50 },
    sections: { type: SectionsSchema, required: true },
    authored: { type: Boolean, default: false },
  },
  { timestamps: true },
);

LessonSchema.index({ slug: 1 }, { unique: true });

export type LessonDoc = InferSchemaType<typeof LessonSchema> & { _id: Types.ObjectId };
export const Lesson = model('Lesson', LessonSchema);
