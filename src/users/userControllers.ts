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
    if (
      !username ||
      !email ||
      !password ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return next(createHttpError(400, "Required all the fields"));
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
    res.status(201).json({
        message: "User registered successfully",
        access_token: token
    })
}

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  // Step 1: Receive user input
  const { email, password } = req.body;

  // Step 2: Validate input
  if (!email || !password || password.trim() === "" || email.trim() === "") {
    return next(createHttpError(403, "Please fill all the required fields"));
  }

  // Step 3: Retrieve user record
  let user = null
  try {
    user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(403, "Invalid email or password"));
    }
  } catch (error) {
    return next(createHttpError("Couldn't retrieve user"));
  }
  

  // Step 4: Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    return next(createHttpError(403, "Invalid email or password"))
  }

  // 5. generate token
  const token = sign({
      _id: user._id,
      username: user.username
  }, config.jwt_secret as string, { expiresIn: "7d"})
  


  res.json({
    message: "User login successfully",
    access_token: token
  });
};

export { userRegister, userLogin };