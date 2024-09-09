import {Response,Request} from 'express'
import { StatusCode } from '../../interfaces/enum'
import AuthUseCases from '../use-cases/authUseCases';
import { LoginResponse, StatusMessage } from '../../interfaces/interface';


const authUseCases=new AuthUseCases()

export default class AuthControllers{

    register=async(req:Request,res:Response)=>{
        try {
           const registerResponse:StatusMessage= await authUseCases.register(req.body) as StatusMessage 
           res.status(registerResponse?.status).json(registerResponse)
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }
    verifyOtp=async(req:Request,res:Response)=>{
        try {
            const {email,otp}=req.body
           const verifyOtpResponse:StatusMessage= await authUseCases.verifyOtp(email,otp) as StatusMessage 
           res.status(verifyOtpResponse?.status).json(verifyOtpResponse)
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }
    login=async(req:Request,res:Response)=>{
        try {
            const {email,password}=req.body
            const loginResponse:LoginResponse | StatusMessage= await authUseCases.login(email,password) as LoginResponse |StatusMessage
            if ('status' in loginResponse) {
                res.status(loginResponse.status).json(loginResponse);
            } else {
                res.status(StatusCode.OK).json(loginResponse);
            }       
         } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }

    public async getUserByEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.params;

            // Validate email presence
            if (!email) {
                return res.status(StatusCode.BadRequest).json({ error: 'Email is required' });
            }

            const user = await authUseCases.getUserByEmail(email);

            // Check if user was found
            if (!user) {
                return res.status(StatusCode.NotFound).json({ message: 'User not found' });
            }

            return res.status(StatusCode.OK).json(user);
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return res.status(StatusCode.InternalServerError).json({ error: 'Error fetching user' });
        }
    }

}