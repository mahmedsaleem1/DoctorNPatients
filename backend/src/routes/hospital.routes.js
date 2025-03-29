import express from "express";
import { importHospitalData } from "../controllers/hospital.controller.js";

const router = express.Router();

router.get("/", importHospitalData);

export default router;