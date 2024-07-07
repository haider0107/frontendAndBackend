import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addChapter,
  addMockTest,
  addQuestions,
  createCourse,
  deleteChapter,
  deleteCourse,
  deleteMockTest,
  deleteQuestions,
  editChapter,
  editCourse,
} from "../controllers/course.controllers.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(createCourse);
router.route("/addChapter").put(addChapter);
router.route("/addMockTest").put(addMockTest);
router.route("/addQuestions").put(addQuestions);
router.route("/deleteQuestions").put(deleteQuestions);
router.route("/deleteMockTest").put(deleteMockTest);
router.route("/deleteChapter").put(deleteChapter);
router.route("/editChapter").put(editChapter);
router.route("/editCourse").put(editCourse);
router.route("/:_id").delete(deleteCourse);

export default router;
