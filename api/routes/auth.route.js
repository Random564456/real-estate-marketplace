import express from "express";
import { singup, signin, google } from "../controller/auth.controller.js";

const router = express.Router();

router.post('/signup', singup);
router.post('/signin', signin);
router.post('/google', google)

export default router;