import express from "express";
import { singup, signin } from "../controller/auth.controller.js";

const router = express.Router();

router.post('/signup', singup);
router.post('/signin', signin);

export default router;