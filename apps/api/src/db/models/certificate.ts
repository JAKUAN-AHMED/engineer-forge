import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const CertificateSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    issuedAt: { type: Date, default: Date.now },
    verificationId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    skills: { type: [String], default: [] },
    pdfUrl: { type: String, default: null },
  },
  { timestamps: true },
);

export type CertificateDoc = InferSchemaType<typeof CertificateSchema> & { _id: Types.ObjectId };
export const Certificate = model('Certificate', CertificateSchema);
