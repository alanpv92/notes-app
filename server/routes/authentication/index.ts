import express from "express";
import authSchema from "../../schema/authentication/index";
import validator from "../../middlewares/validator";
import authenticationController from "../../controllers/authentication/index";
const router = express.Router();

router.post("/login", authSchema.loginSchema, validator,authenticationController.login);
router.post("/register", authSchema.registerSchema, validator,authenticationController.register);

export default router;
