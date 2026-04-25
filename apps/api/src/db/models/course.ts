import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const CourseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    stage: { type: Number, min: 1, max: 5, required: true },
    order: { type: Number, required: true },
    estimatedHours: { type: Number, default: 0 },
    icon: { type: String, default: 'book' },
    tags: { type: [String], default: [] },
    moduleIds: { type: [Schema.Types.ObjectId], ref: 'Module', default: [] },
  },
  { timestamps: true },
);

export type CourseDoc = InferSchemaType<typeof CourseSchema> & { _id: Types.ObjectId };
export const Course = model('Course', CourseSchema);
