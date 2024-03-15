import adminModel from "../models/Admin.models.js";
import { matchPassword } from "../helper/auth.password.js";
import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const ContactControllers = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const existedUser = await userModel.findOne({ email });

        if (existedUser) {
            return res.status(401).send({
                success: false,
                message: "User Already Registered"
            });
        }

        const user = await userModel.create({ name, email, phone, message });
        if(user){
            res.status(200).send({
                success: true,
                message: "Thanks For Contacting Us. We will respond within 1 day",
                user
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: error
        });
    }
}


const loginController = async (req, res) => {
    try {
        
        const {email , password} = req.body;

        if(!email)
        {
            res.status(300).send({
                success:false,
                message:'email required'
            })
        }
        
        const user = await adminModel.findOne({email})
        const CheckPassword = await matchPassword(password, user.password)
        if(!CheckPassword)
        {
            res.status(401).send({
                success:false,
                message:'email and password are incorrect'
            })
        }

    } catch (error) {
        
     res.status(400).send({
        success:false,
        message:'Something Wrong to Login'
     })
    }
}

const isAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const Admin = await adminModel.findOne({ email });

        if (!Admin) {
            return res.status(401).send({ success: false, message: "Invalid email or password" });
        }

        // Match password
        const AdminPassword  = await matchPassword(password , Admin.password)

        if (!AdminPassword) {
            return res.status(401).send({ success: false, message: "Invalid email or password" });
        }

        // Sign JWT token
        const token = jwt.sign({_id: Admin._id}, process.env.JWT_SECRET, { expiresIn: '2d' });

        if (Admin.role === 1) {
            res.status(200).send({ success: true, message: "Admin logged in successfully", Admin, token });
        } else {
            res.status(401).send({
                success: false,
                message: 'Unauthorized Access'
            });
        }
      
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}

// Assuming you have userModel defined properly and imported

const ContactData = async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  
      const skip = (page - 1) * limit;
      const total = await userModel.countDocuments();
      
      const data = await userModel.find().skip(skip).limit(limit);
  
      res.status(200).json({
        data,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };
  
  

export { ContactControllers , isAdmin , loginController , ContactData};
