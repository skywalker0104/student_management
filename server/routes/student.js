import express from "express";
import { verifyToken } from "../midleware/login.midleware.js";
import { upload } from "../midleware/upload.midleware.js";
import XLSX from "xlsx";
import {
  createStudent,
  deleteStudent,
  getAllStudent,
  getAllScore,
  getStudentDetail,
  getScoreDetail,
  importFromExcel,
  importScoreFromExcel,
  updateStudent,
  updateAcademic,
} from "../controllers/student.controller.js";
import multer from "multer";

const router = express.Router();

router.post("/student/create/import", upload.single("myFile"), importFromExcel);

router.post(
  "/student/create/importScore",
  upload.single("myFile"),
  importScoreFromExcel
);

router.patch("/student/update/:id", updateStudent);

router.patch("/student/updateacademic/:id", updateAcademic);

router.post("/student/create", createStudent);

router.delete("/student/delete/:id", deleteStudent);

//Get 1 student by id
router.get("/student/:id", getStudentDetail);

router.get("/studentscore/:msv", getScoreDetail);

// Get all students in a class
router.get("/student/all/:lop", getAllStudent);

router.get("/student/allscore/:hocky", getAllScore);

export default router;
