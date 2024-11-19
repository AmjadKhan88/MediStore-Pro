import { addUser, loginUser } from '../controllers/user.controller.js';
import express from 'express';

const userRoute= express.Router();


userRoute.post('/add',addUser);
userRoute.post('/login',loginUser);



export default userRoute;