import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import {sign} from "jsonwebtoken";
import { config } from "../utils/config";

const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    // get the data 
    const { username, email, password } = req.body;
    // validation
    if(!username || !email || !password || username === "" || email === "" || password === "") {
        return next(createHttpError(400, "Required all the fields"))
    }
    // check if already exists
    const user = await userModel.findOne({ email });
    if(user) {
        return next(createHttpError(400, "User already exists"))
    }
    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // save to db
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    // generate token
    const token = sign({
        _id: newUser._id,
        username: newUser.username
    }, config.jwt_secret as string, { expiresIn: "7d"})
    // response
    res.json({
        message: "User registered successfully",
        access_token: token
    })
}

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: "User login successfully"
    })
};

export { userRegister, userLogin };