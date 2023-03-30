import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  msv: {
    type: String,
    required: true,
  },
  sum_of_credits: {
    type: Number,
  },
  drl: {
    type: Number,
  },
  tbhk: {
    type: Number,
  },
  gpa: {
    type: Number,
  },
  status: {
    type: String,
    enum: [
      "Không",
      "Cảnh báo học tập",
      "Đình chỉ học tập",
      "Thiếu tín chỉ",
      "Thiếu học phí",
      "Khen thưởng",
    ],
    default: "Không",
  },
  lop: {
    type: String,
    required: true,
  },
  hocky: {
    type: String,
    required: true,
  },
});
// export collection name 'users' storing login infomation
const Score = mongoose.model("score", userSchema);
export default Score;
