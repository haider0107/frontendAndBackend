import mongoose, { Schema } from "mongoose";

// Option Schema
const optionSchema = new Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

// Question Schema
const questionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    options: [optionSchema],
  },
  { _id: false }
);

// Mock Test Schema
const mockTestSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
  },
  { _id: false }
);

// Chapter Schema
const chapterSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  mockTests: [mockTestSchema],
});

// Course Schema
const courseSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  chapters: [chapterSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Create the Course model and export
export const Course = mongoose.model("Course", courseSchema);
