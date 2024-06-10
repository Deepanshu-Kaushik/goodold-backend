import express from "express";
import { login, token } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/token", token);

export default router;
