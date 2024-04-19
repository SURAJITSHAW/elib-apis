import { NextFunction, Request, Response, raw } from "express";
import cloudinary from "../utils/cloudinary";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files) {
      return next(createHttpError(400, "No cover image uploaded"));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; 

    const coverImage = files.coverImage[0];
    const file = files.file[0];

    // Upload cover image to Cloudinary
    const coverImageUpload = await cloudinary.uploader.upload(coverImage.path, {
      folder: "cover-images", // Set folder in Cloudinary
      resource_type: "auto", // Automatically detect resource type
    });
    // Upload cover image to Cloudinary
    const bookPdfUpload = await cloudinary.uploader.upload(file.path, {
      folder: "book-pdfs", // Set folder in Cloudinary
      resource_type: "raw", // Automatically detect resource type
    });

    // Delete the local file after upload (optional)
    // fs.unlinkSync(coverImage.path);

    res.json({
      message: "Book created successfully!",
      data: [coverImageUpload, bookPdfUpload], // Response from Cloudinary
    });
  } catch (error) {
    next(createHttpError(500, "Internal server error"));
  }
};


export {
    createBook
}