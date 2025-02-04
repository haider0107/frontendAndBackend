import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes imports
import usersRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/courses", courseRoutes);

export { app };
