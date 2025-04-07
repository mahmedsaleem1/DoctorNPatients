import express from "express";
import sessionConfig from "./config/sessionsConfig.js";
import diagnoserRoutes from "./routes/aiDiagnoser.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import patientRoutes from "./routes/patient.route.js";
import cookieParser from "cookie-parser";
import hospitalRoutes from "./routes/hospital.routes.js";
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import './config/passportDoctor.js'; 
import './config/passportPatient.js'; 
import authDoctorRoutes from './routes/authDoctor.route.js';
import authPatientRoutes from './routes/authPatient.route.js';
import appointmentRoute from "./routes/appointment.route.js";
import reviewRoute from "./routes/review.route.js";


dotenv.config();

const app = express();

// Middleware
app.use(sessionConfig);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cookieParser())
app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/diagnoser", diagnoserRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/hospital", hospitalRoutes);
app.use("/auth/doctor", authDoctorRoutes);
app.use("/auth/patient", authPatientRoutes);
app.use("/api/v1/appointment", appointmentRoute)
app.use("/api/v1/review", reviewRoute)

// -????????????????????????????????????????????????????????????????
app.get("/", (req, res) => {
  res.render("homepage");
});

app.get('/test', (req, res) => {
  res.send('test');
})

app.get("/doctorlogin", (req, res) => {
  res.render("loginDoctor", { title: "Doctor Login" });
});

app.get("/doctorsend-otp", (req, res) => {
  res.render("doctorsendOTP", { title: "Send OTP" });
})

app.get("/doctorforgetpassword", (req, res) => {
  res.render("doctorforgetPassword", { title: "Doctor Forget Password" });
});

app.get("/doctorregister", (req, res) => {
  res.render("doctorRegistration", { title: "Doctor Register" });
})

app.get("/doctorupdate", (req, res) => {
  res.render("doctorUpdate", { title: "Doctor Update" });
})

app.get("/patientlogin", (req, res) => {
  res.render("loginPatient");
});

app.get("/patientsend-otp", (req, res) => {
  res.render("patientsendOTP");
})

app.get("/patientforgetpassword", (req, res) => {
  res.render("patientforgetPassword");
})

app.get("/patientregister", (req, res) => {
  res.render("patientRegistration");
})

app.get("/patientupdate", (req, res) => {
  res.render("patientUpdate", { title: "Doctor Update" });
})

app.get("/hospitals", (req, res) => {
  res.render("getHospitals", { title: "Hospitals" });
})

app.get(`/disease-diagnoser`, (req, res) => {
  res.render("diseaseDiagnoser");
})

app.get("/search-doctors", (req, res) => {
  res.render("getAllDoctors");
})

app.get("/doctor/settings", (req, res) => {
  res.render("doctorSettings", { title: "Doctor Settings" });
})

app.get("/patient/settings", (req, res) => {
  res.render("patientSettings", { title: "Patient Settings" });
})

app.get("/patient/dashboard", (req, res) => {
  res.render("patientDashboard", { title: "Patient Dashboard" });
})

app.get("/doctor/dashboard", (req, res) => {
  res.render("doctorDashboard", { title: "Doctor Dashboard" });
})

app.get('/doctor/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId;
  res.render('doctorProfileNAppointment', { doctorId });
})

app.get('/patient/review/create/:appointmentId', (req, res) => {
  const appointmentId = req.params.appointmentId;
  
  res.render('reviewFromPatient', { appointmentId });
})

export default app;
