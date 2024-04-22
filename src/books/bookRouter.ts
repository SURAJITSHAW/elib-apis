import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from './../middlewares/authenticate';

const bookRouter = express.Router();

// TODO: file stores locally -> upload on cloudinary -> delete local files
const upload = multer({
    dest: path.resolve(__dirname, "../../public/uploads"),
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
})

bookRouter.post("/" , upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "file", maxCount: 1}
]), createBook)

export default bookRouter;
