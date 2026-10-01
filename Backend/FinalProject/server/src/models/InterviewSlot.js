import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "CANCELLED"],
      default: "AVAILABLE",
      index: true,
    },
    title: { type: String, trim: true, default: "Interview" },
    meetingLink: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

slotSchema.index({ recruiter: 1, startTime: 1, endTime: 1 });
slotSchema.index({ candidate: 1, status: 1, startTime: 1, endTime: 1 });
export default mongoose.model("InterviewSlot", slotSchema);
