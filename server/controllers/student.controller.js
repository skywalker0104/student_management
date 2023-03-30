import Student from "../models/student.model.js";
import Users from "../models/user.model.js";
import Score from "../models/score.model.js";
import xlsx from "xlsx";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import axios from "axios";
const headers = {
  "PRIVATE-KEY": "14bf1d3f-a86c-4b1b-ad74-9675722ee4f8",
};
export const getAllScore = async (req, res) => {
  try {
    const ListScores = await Score.find({ hocky: req.params.hocky });

    res.json({ success: true, ListScores });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error ~ getAllScore" });
  }
};

export const getAllStudent = async (req, res) => {
  try {
    const ListStudents = await Student.find({ lop: req.params.lop });

    res.json({ success: true, ListStudents });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error ~ getAllStudent" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      birthday,
      gender,
      phone,
      address,
      sum_of_credits,
      gpa,
      status,
    } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: req.params.id },
      { name, birthday, gender, phone, address }
    );
    if (updatedStudent) {
      res.json({ message: "Update successfully" });
    } else {
      res.json({ message: "Update fail" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error ~ updateStudent" });
  }
};

export const updateAcademic = async (req, res) => {
  try {
    const { sum_of_credits, gpa, status } = req.body;
    const updatedStudent = await Score.findByIdAndUpdate(
      { _id: req.params.id },
      { sum_of_credits, gpa, status }
    );
    if (updatedStudent) {
      res.json({ message: "Update successfully" });
    } else {
      res.json({ message: "Update fail" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error ~ updateStudent" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const {
      msv,
      name,
      birthday,
      gender,
      phone,
      address,
      sum_of_credits,
      drl,
      tbhk,
      gpa,
      status,
      lop,
      hocky,
    } = req.body;

    const isExist = await Student.findOne({ msv });
    if (isExist) {
      return res
        .status(400)
        .json({ success: false, message: "Student already exist!" });
    }

    const newStudent = new Student({
      msv,
      name,
      birthday,
      gender,
      phone,
      address,
      lop,
    });
    await newStudent.save();
    console.log(newStudent);
    const newScore = new Score({
      msv,
      sum_of_credits,
      drl,
      tbhk,
      gpa,
      status,
      lop,
      hocky,
    });
    await newScore.save();
    console.log("Create successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error ~ createStudent" });
  }
};

export const deleteStudent = async (req, res) => {
  // const userID = req.params.id;
  try {
    const deletedStudent = await Student.findOneAndDelete({
      _id: req.params.id,
    });
    if (deletedStudent) {
      res.json({ success: true, message: "Deleted successfully!" });
    } else {
      res.status(404).json({ success: false, message: "Deleted fail!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error ~ deleteStudent" });
  }
};
export const importFromExcel = async (req, res) => {
  try {
    const wb = xlsx.readFile("./uploads/import.xlsx", { cellDates: true });
    const ws = wb.Sheets["Sheet1"];
    const dataStudent = xlsx.utils.sheet_to_json(ws);
    const dataUser = [];
    const isImported = await Student.insertMany(dataStudent);
    if (isImported) {
      console.log("Import successfully");
    } else {
      console.log("Import fail");
    }
    for (var i = 0; i < dataStudent.length; i++) {
      dataUser[i] = new Users({
        username: dataStudent[i].msv,
        password: await argon2.hash(dataStudent[i].msv.toString()),
        lop: dataStudent[i].lop,
      });
      await dataUser[i].save();
      jwt.sign({ userId: dataUser[i]._id }, process.env.ACCESS_TOKEN_SECRET);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error ~ importFromExcel" });
  }
};

export const importScoreFromExcel = async (req, res) => {
  try {
    const wb = xlsx.readFile("./uploads/import.xlsx", { cellDates: true });
    const ws = [];
    ws[0] = wb.Sheets["Sheet2"];
    ws[1] = wb.Sheets["Sheet3"];
    ws[2] = wb.Sheets["Sheet4"];
    ws[3] = wb.Sheets["Sheet5"];
    ws[4] = wb.Sheets["Sheet6"];
    ws[5] = wb.Sheets["Sheet7"];
    ws[6] = wb.Sheets["Sheet8"];
    ws[7] = wb.Sheets["Sheet9"];
    ws[8] = wb.Sheets["Sheet10"];
    const dataScore = [];
    for (var i = 0; i < 9; i++) {
      dataScore[i] = xlsx.utils.sheet_to_json(ws[i]);
    }
    const isImported = await Score.insertMany(dataScore[0]);
    await Score.insertMany(dataScore[1]);
    await Score.insertMany(dataScore[2]);
    await Score.insertMany(dataScore[3]);
    await Score.insertMany(dataScore[4]);
    await Score.insertMany(dataScore[5]);
    await Score.insertMany(dataScore[6]);
    await Score.insertMany(dataScore[7]);
    await Score.insertMany(dataScore[8]);
    console.log(isImported);
    if (isImported) {
      console.log("Import successfully");
    } else {
      console.log("Import fail");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error ~ importScoreFromExcel" });
  }
};

export const getScoreDetail = async (req, res) => {
  try {
    const ScoreDetail = await Score.find({ msv: req.params.msv });
    res.json({ ScoreDetail });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error ~ getScoreDetail" });
  }
};

export const getStudentDetail = async (req, res) => {
  try {
    const StudentDetail = await Student.find({ _id: req.params.id });
    res.json({ StudentDetail });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error ~ getStudentDetail" });
  }
};
