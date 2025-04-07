import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from '../utils/apiResponse.js';

const prisma = new PrismaClient();

export const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { appointment_id } = req.params;
    const patient_id = req.user.patient_id;  // Assuming user is authenticated and has patient_id

    // Fetch the appointment based on the appointment_id
    const appointment = await prisma.appointments.findUnique({
        where: {
            appointment_id: appointment_id
        }
    });

    // If the appointment doesn't exist
    if (!appointment) {
        throw new ApiError(404, 'Appointment not found');
    }

    // Check if the patient is authorized to review this appointment
    if (appointment.patient_id !== patient_id) {
        throw new ApiError(403, 'You are not authorized to review this appointment');
    }

    // Check if the appointment status allows reviews
    if (appointment.status !== 'completed') {
        throw new ApiError(400, 'You cannot review an appointment that has not been completed');
    }

    // Check if the appointment has been cancelled or is pending
    if (appointment.status === 'cancelled' || appointment.status === 'pending') {
        throw new ApiError(400, 'You cannot review an appointment that has been cancelled or pending');
    }

    // Check if the appointment already has a review
    const existingReview = await prisma.reviews.findUnique({
        where: {
            appointment_id: appointment_id
        }
    });

    // If a review already exists for this appointment, return an error
    if (existingReview) {
        throw new ApiError(400, 'A review for this appointment already exists');
    }

    // Create the new review
    const review = await prisma.reviews.create({
        data: {
            rating: parseInt(rating),  // Ensure rating is an integer
            comment: comment,
            appointment_id: appointment_id
        }
    });

    // Return a response with the newly created review
    return res.json(new ApiResponse(201, review, "Revview Created Successfully"));
});

export const getReviewsOfDoctor = asyncHandler(async (req, res) => {
    const { doctor_id } = req.params;

    const reviews = await prisma.reviews.findMany({
        where: {
            Appointment: {
                doctor_id
            }
        }
    });
    
    if (!reviews) {
        throw new ApiError(404, 'No reviews found for this doctor');
    }

    return res.status(200)
    .json(new ApiResponse(200, reviews,"Reviews Feteched Successfully"));
});

export const getReviewsofLoggedInDoctor = asyncHandler(async (req, res) => {
    const { doctor_id } = req.user; // Assuming user is authenticated and has doctor_id

    const reviews = await prisma.reviews.findMany({
        where: {
            Appointment: {
                doctor_id
            }
        }
    });
    
    if (!reviews) {
        throw new ApiError(404, 'No reviews found for this doctor');
    }

    return res.status(200)
    .json(new ApiResponse(200, reviews,"Reviews Feteched Successfully"));
});

export const getReviewsOfPatient = asyncHandler(async (req, res) => {
    const { patient_id } = req.params;

    const reviews = await prisma.reviews.findMany({
        where: {
            Appointment: {
                patient_id
            }
        }
    });
    
    if (!reviews) {
        throw new ApiError(404, 'No reviews given by this patient');
    }

    return res.status(200)
    .json(new ApiResponse(200, reviews,"Reviews Feteched Successfully"));
});

export const reviewExists = asyncHandler(async (req, res) => {
    const { appointment_id } = req.params;

    // Check if the review exists for the given appointment_id and patient_id
    const review = await prisma.reviews.findUnique({
        where: {
            appointment_id: appointment_id
        }
    });

    if (!review) {
        return res.status(404).json(new ApiResponse(404, false, "Review not found"));
    }

    return res.status(200).json(new ApiResponse(200, true, "Review Found"));
});