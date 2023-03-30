import mongoose from "mongoose";
const Schema = mongoose.Schema;
const studentSchema = new mongoose.Schema({
  msv: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Nam", "Nữ"],
    default: "Nam",
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  sum_of_credits: {
    type: Number,
    default: 0,
  },
  gpa: {
    type: Number,
    default: 0,
  },
  lop: {
    type: String,
    required: true,
  },
});
//export collection name 'student' storing student info
const Student = mongoose.model("students", studentSchema);
export default Student;
