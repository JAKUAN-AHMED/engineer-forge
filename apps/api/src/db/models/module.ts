import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const ModuleSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true },
    lessonIds: { type: [Schema.Types.ObjectId], ref: 'Lesson', default: [] },
  },
  { timestamps: true },
);

ModuleSchema.index({ courseId: 1, slug: 1 }, { unique: true });

export type ModuleDoc = InferSchemaType<typeof ModuleSchema> & { _id: Types.ObjectId };
export const LessonModule = model('Module', ModuleSchema);
