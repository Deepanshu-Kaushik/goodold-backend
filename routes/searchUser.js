import express from "express";
import { searchUser } from "../controllers/searchUser.js";
const router = express.Router();

router.post('/', searchUser);

export default router;
