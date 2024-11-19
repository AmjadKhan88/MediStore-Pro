import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { addPatients, allPatients, deletePatients, singlePatients, updatePatients } from '../controllers/patients.controller.js';

const patientsRoute = express.Router();


// get all patients
patientsRoute.get("/all/:keywords?", authMiddleware, allPatients);

// get single patien
patientsRoute.get("/single/:id",authMiddleware,singlePatients);

// save  patients
patientsRoute.post("/add",authMiddleware,addPatients);

// update  patients 
patientsRoute.post("/update/:id",authMiddleware,updatePatients);

// delete patients
patientsRoute.post("/delete/:id",authMiddleware,deletePatients);

export default patientsRoute;