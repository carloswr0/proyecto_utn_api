import express from "express";
import ENVIRONTMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongoDB.config.js";
import healthRouter from "./routers/health.router.js";
import authRouter from "./routers/auth.router.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
import workspaceRouter from "./routers/workspace.router.js";
import cors from 'cors';

connectMongoDB();

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/workspaces", AuthMiddleware, workspaceRouter);

app.use('/api/test', AuthMiddleware, (req, res) => {
  res.json({ message: `Test endpoint is working! ${req.user ? req.user.name : 'Guest'}` });
});

app.listen(ENVIRONTMENT.PORT, () => {
  console.log("Express server is running on port: ", ENVIRONTMENT.PORT)
})

// https://github.com/Matu-Dev-JS/2026_UTN_TT_ENERO_LUN_MIE_PWA