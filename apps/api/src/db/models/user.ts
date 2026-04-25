import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    xp: { type: Number, default: 0 },
    level: { type: String, enum: ['beginner', 'engineer', 'advanced'], default: 'beginner' },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },
    badges: { type: [String], default: [] },
    completedLessonIds: { type: [Schema.Types.ObjectId], default: [] },
    weakTopics: { type: [String], default: [] },
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: true },
);

UserSchema.index({ xp: -1 });

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };
export const User = model('User', UserSchema);
