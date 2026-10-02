import { Router } from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import InterviewSlot from "../models/InterviewSlot.js";
import { protect, roles } from "../middleware/auth.js";

const router = Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ message: errors.array()[0].msg });
  next();
};
const timeRules = [
  body("startTime")
    .isISO8601()
    .withMessage("startTime must be a valid ISO date"),
  body("endTime").isISO8601().withMessage("endTime must be a valid ISO date"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Title is too long"),
  body("meetingLink")
    .optional({ values: "falsy" })
    .isURL({ protocols: ["http", "https"] })
    .withMessage("meetingLink must be a valid URL"),
];
const overlap = (startTime, endTime) => ({
  startTime: { $lt: new Date(endTime) },
  endTime: { $gt: new Date(startTime) },
  status: { $ne: "CANCELLED" },
});
const checkTimes = (req, res, next) => {
  if (new Date(req.body.startTime) >= new Date(req.body.endTime))
    return res
      .status(422)
      .json({ message: "End time must be after start time" });
  next();
};

router.get("/", async (req, res, next) => {
  try {
    const filter = {
      status: req.query.status || "AVAILABLE",
      startTime: { $gte: new Date() },
    };
    const slots = await InterviewSlot.find(filter)
      .populate("recruiter", "name email")
      .sort({ startTime: 1 });
    res.json({ slots });
  } catch (error) {
    next(error);
  }
});

router.use(protect);
router.get("/mine", async (req, res, next) => {
  try {
    const filter =
      req.user.role === "recruiter"
        ? { recruiter: req.user._id }
        : { candidate: req.user._id };
    const slots = await InterviewSlot.find(filter)
      .populate("recruiter candidate", "name email")
      .sort({ startTime: 1 });
    res.json({ slots });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  roles("recruiter"),
  timeRules,
  validate,
  checkTimes,
  async (req, res, next) => {
    try {
      const conflict = await InterviewSlot.findOne({
        recruiter: req.user._id,
        ...overlap(req.body.startTime, req.body.endTime),
      });
      if (conflict)
        return res.status(409).json({
          message: "This time overlaps another slot in your schedule",
        });
      const slot = await InterviewSlot.create({
        ...req.body,
        recruiter: req.user._id,
      });
      res.status(201).json({ slot });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/:id/book", roles("candidate"), async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    let booked;
    await session.withTransaction(async () => {
      const slot = await InterviewSlot.findOne({
        _id: req.params.id,
        status: "AVAILABLE",
      }).session(session);
      if (!slot) {
        const error = new Error(
          "This slot has already been booked or cancelled",
        );
        error.status = 409;
        throw error;
      }
      const candidateConflict = await InterviewSlot.findOne({
        candidate: req.user._id,
        ...overlap(slot.startTime, slot.endTime),
      }).session(session);
      if (candidateConflict) {
        const error = new Error(
          "You already have an interview during this time",
        );
        error.status = 409;
        throw error;
      }
      booked = await InterviewSlot.findOneAndUpdate(
        { _id: slot._id, status: "AVAILABLE" },
        { candidate: req.user._id, status: "BOOKED" },
        { new: true, session },
      );
    });
    res.json({ message: "Interview booked successfully", slot: booked });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
});

router.patch(
  "/:id",
  roles("recruiter"),
  timeRules,
  validate,
  checkTimes,
  async (req, res, next) => {
    try {
      const slot = await InterviewSlot.findOne({
        _id: req.params.id,
        recruiter: req.user._id,
      });
      if (!slot) return res.status(404).json({ message: "Slot not found" });
      if (slot.status === "BOOKED")
        return res
          .status(409)
          .json({ message: "Booked interviews cannot be rescheduled here" });
      const conflict = await InterviewSlot.findOne({
        _id: { $ne: slot._id },
        recruiter: req.user._id,
        ...overlap(req.body.startTime, req.body.endTime),
      });
      if (conflict)
        return res.status(409).json({
          message: "This time overlaps another slot in your schedule",
        });
      Object.assign(slot, req.body);
      await slot.save();
      res.json({ slot });
    } catch (error) {
      next(error);
    }
  },
);

router.delete("/:id", roles("recruiter"), async (req, res, next) => {
  try {
    const slot = await InterviewSlot.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user._id, status: "AVAILABLE" },
      { status: "CANCELLED" },
      { new: true },
    );
    if (!slot)
      return res
        .status(404)
        .json({ message: "Only available slots can be cancelled" });
    res.json({ slot });
  } catch (error) {
    next(error);
  }
});

export default router;
