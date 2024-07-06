import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addChapter,
  addMockTest,
  addQuestions,
  createCourse,
} from "../controllers/course.controllers.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(createCourse);
router.route("/addChapter").put(addChapter);
router.route("/addMockTest").put(addMockTest);
router.route("/addQuestions").put(addQuestions);

export default router;
