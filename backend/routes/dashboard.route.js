import express from 'express';
import { expire_medicine, finished_medicine, storeInfo } from '../controllers/dashboard.controller.js';
import authMiddleware from '../middlewares/auth.js';

const dashboardRoute = express.Router();

dashboardRoute.get('/all', authMiddleware,storeInfo);

dashboardRoute.get('/expired_medicine',authMiddleware,expire_medicine)

dashboardRoute.get('/finished_medicine',authMiddleware,finished_medicine)




export default dashboardRoute;