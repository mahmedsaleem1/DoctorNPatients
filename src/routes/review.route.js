import { Router } from "express";
import { createReview, getReviewsOfDoctor, getReviewsOfPatient, getReviewsofLoggedInDoctor, reviewExists } from "../controllers/review.controller.js";
import { authDoctor, authPatient } from "../middlewares/auth.middleware.js";

const router = Router();

router.route(`/create/:appointment_id`).post(authPatient, createReview);
router.route(`/doctor/:doctor_id`).get(getReviewsOfDoctor);
router.route(`/patient/:patient_id`).get(getReviewsOfPatient);
router.route(`/doctor`).get(authDoctor, getReviewsofLoggedInDoctor);
router.route(`/exists/:appointment_id`).get(reviewExists);


export default router;