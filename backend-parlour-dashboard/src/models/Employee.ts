import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  role: 'employee' | 'admin' | 'superadmin';
}

const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['employee', 'admin', 'superadmin'], default: 'employee' },
}, { timestamps: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema); 