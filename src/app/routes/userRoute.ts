import express, { Router, Request, Response } from 'express';
import AuthControllers from '../controllers/authController';
import JwtControllers from '../../services/jwt';



const jwtController=new JwtControllers()

const userRoute: Router = express.Router();
const authController = new AuthControllers();

userRoute.post('/register', authController.register);
userRoute.post('/verifyOtp', authController.verifyOtp);
userRoute.post('/login', authController.login);
userRoute.get('/getUser/:email',jwtController.isAuthenticated, authController.getUserByEmail);


userRoute.get('/refresh',jwtController.refreshToken);
userRoute.post('/logout', jwtController.isAuthenticated, jwtController.logout);


export default userRoute;