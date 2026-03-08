import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  course_id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  instructor: string;
  category: string;
  registration_url?: string;
  zoom_link?: string;
  start_date?: string;
  end_date?: string;
  is_published?: boolean;
  created_at: Date;
  updated_at: Date;
}

const CourseSchema: Schema = new Schema(
  {
    course_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    instructor: { type: String, required: true },
    category: { type: String, required: true },
    registration_url: { type: String },
    zoom_link: { type: String },
    start_date: { type: String },
    end_date: { type: String },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model<ICourse>('Course', CourseSchema, 'courses_collection'); // Explicitly specifying collection name to avoid pluralization issues
