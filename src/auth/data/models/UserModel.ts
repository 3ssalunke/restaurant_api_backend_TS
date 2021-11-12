import { Document, Schema } from "mongoose";

export interface UserModel extends Document {
  type: string;
  name: string;
  email: string;
  password?: string;
}

export const userSchema = new Schema({
  type: { type: String, required: true },
  name: String,
  email: { type: String, required: true },
  password: String,
});
