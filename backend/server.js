import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import messageRoutes from "./routes/message.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/message", messageRoutes);

// DB connection + server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
