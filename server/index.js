import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import userRoutes from "./routes/UserRoute.js";
import chatRoutes from "./routes/ChatRoute.js";
import groupRoutes from "./routes/GroupRoute.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.js";
import { initializeSocket } from "./socket/socketHandler.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
const server = createServer(app);

initializeSocket(server, app);

connectDB();
cloudinaryConnect();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/group", groupRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Chat App</h1>");
});

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});

export default server;
