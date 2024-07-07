import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const user = req.user;

  const existedCourse = await Course.findOne({ title });

  if (existedCourse) {
    throw new ApiError(409, "Course already created !!!");
  }

  const course = await Course.create({
    title,
    description,
    owner: user._id,
  });

  const createdCourse = await Course.findById(course._id);

  if (!createdCourse) {
    throw new ApiError(
      500,
      "Something went wrong while creating the course !!!"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdCourse, "Course created Successfully"));
});

const addChapter = asyncHandler(async (req, res) => {
  const { _id, title, content } = req.body;

  const user = req.user;
  const course = await Course.findById(_id);

  //   console.log(course, "\n", user);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  course.chapters.push({ title, content });

  const updateCourse = await Course.findOneAndUpdate(
    { _id },
    {
      chapters: course.chapters,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateCourse, "Chapter added successfully"));
});

const addMockTest = asyncHandler(async (req, res) => {
  const { _id, chapterId, title, description } = req.body;
  const user = req.user;
  let chapterIndex;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  course.chapters.forEach((ele, i) => {
    if (ele._id.equals(chapterId)) {
      chapterIndex = i;
      return;
    }
  });

  course.chapters[chapterIndex].mockTests.push({ title, description });

  const updateCourse = await Course.findOneAndUpdate(
    { _id },
    {
      chapters: course.chapters,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateCourse, "MockTest added successfully"));
});

const addQuestions = asyncHandler(async (req, res) => {
  const { _id, chapterId, questionText, options } = req.body;
  const user = req.user;
  let chapterIndex;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  course.chapters.forEach((ele, i) => {
    if (ele._id.equals(chapterId)) {
      chapterIndex = i;
      return;
    }
  });

  course.chapters[chapterIndex].mockTests[0].questions.push({
    questionText,
    options,
  });

  const updateCourse = await Course.findOneAndUpdate(
    { _id },
    {
      chapters: course.chapters,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateCourse, "Questions added successfully"));
});

const deleteQuestions = asyncHandler(async (req, res) => {
  const { _id, chapterId, questionText } = req.body;
  const user = req.user;
  let chapterIndex;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  course.chapters.forEach((ele, i) => {
    if (ele._id.equals(chapterId)) {
      chapterIndex = i;
      return;
    }
  });

  let data = course.chapters[chapterIndex].mockTests[0].questions.filter(
    (ele) => ele.questionText !== questionText
  );

  course.chapters[chapterIndex].mockTests[0].questions = data;

  const updateCourse = await Course.findOneAndUpdate(
    { _id },
    {
      chapters: course.chapters,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateCourse, "Questions deleted successfully"));
});

const deleteMockTest = asyncHandler(async (req, res) => {
  const { _id, chapterId } = req.body;
  const user = req.user;
  let chapterIndex;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  course.chapters.forEach((ele, i) => {
    if (ele._id.equals(chapterId)) {
      chapterIndex = i;
      return;
    }
  });

  course.chapters[chapterIndex].mockTests[0] = [];

  const updateCourse = await Course.findOneAndUpdate(
    { _id },
    {
      chapters: course.chapters,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateCourse, "Mocktest deleted successfully"));
});

const deleteChapter = asyncHandler(async (req, res) => {
  const { _id, chapterId } = req.body;
  const user = req.user;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  const updateCourse = await Course.findByIdAndUpdate(
    { _id },
    {
      $pull: { chapters: { _id: chapterId } },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateCourse, "Mocktest deleted successfully"));
});

const editChapter = asyncHandler(async (req, res) => {
  const { _id, chapterId, title, content } = req.body;
  const user = req.user;
  let chapterIndex;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  course.chapters.forEach((ele, i) => {
    if (ele._id.equals(chapterId)) {
      chapterIndex = i;
      return;
    }
  });

  if (title) {
    course.chapters[chapterIndex].title = title;
  }

  if (content) {
    course.chapters[chapterIndex].content = content;
  }

  await course.save();

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Chapter editied successfully"));
});

const editCourse = asyncHandler(async (req, res) => {
  const { _id, title, description } = req.body;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  if (title) {
    course.title = title;
  }

  if (description) {
    course.description = description;
  }

  await course.save();

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course editied successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const course = await Course.findById(_id);

  if (!course.owner.equals(user._id)) {
    throw new ApiError(403, "Not Authorized !!!");
  }

  await Course.findByIdAndDelete(_id);

  return res
    .status(204)
    .json(new ApiResponse(204, {}, "Course Deleted successfully"));
});

export {
  createCourse,
  addChapter,
  addMockTest,
  addQuestions,
  deleteQuestions,
  deleteMockTest,
  deleteChapter,
  editChapter,
  editCourse,
  deleteCourse
};
