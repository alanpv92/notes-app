import express from "express";
import authRouter from "../routes/authentication/index";
const router=express.Router();

router.use("/auth",authRouter);


export default router;