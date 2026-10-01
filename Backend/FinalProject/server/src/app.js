import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import slotRoutes from "./routes/slots.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", service: "interviewly-api" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use((error, _req, res, _next) => {
  console.error(error);
  res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong" });
});
export default app;
