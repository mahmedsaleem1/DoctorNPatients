import { Router } from "express";
import { registerDoctor, loginDoctor, logoutDoctor, sendOtp, verifyOtp,
        getCurrentDoctor, updateDoctorInfo, registerOAuthDoctor, getAllDoctors, getDoctorById } from '../controllers/doctor.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
import { authDoctor } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name : "profile_picture",
        maxCount : 1
    },
    {
        name : "video_intro",
        maxCount : 1
    }
]), registerDoctor);

router.route("/login").post(loginDoctor);
router.route("/logout").post(authDoctor, logoutDoctor);
router.route("/send-otp").post(sendOtp); 
router.route("/reset-password").post(verifyOtp); 
router.route("/getCurrentDoctor").get(authDoctor, getCurrentDoctor);
router.route("/updateDoctorInfo").post(authDoctor, updateDoctorInfo)
router.route("/updateOAuthDoctor").post(upload.fields([
    {
        name : "profile_picture",
        maxCount : 1
    },
    {
        name : "video_intro",
        maxCount : 1
    }
]), registerOAuthDoctor);
router.route("/get/all-doctors").get(getAllDoctors);
router.route("/get/:doctor_id").get(getDoctorById);


export default router;
