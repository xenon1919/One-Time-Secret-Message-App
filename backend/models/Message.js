import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    ttl: { type: Number, default: 60 }, // in minutes
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
