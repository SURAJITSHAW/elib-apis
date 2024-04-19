import { NextFunction, Request, Response, raw } from "express";
import cloudinary from "../utils/cloudinary";
import createHttpError from "http-errors";
import Book from "./bookModel";
import fs from "node:fs"

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {title, genre} = req.body;
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
      filename_override: file.filename + ".pdf",
      folder: "book-pdfs", // Set folder in Cloudinary
      resource_type: "raw", // Automatically detect resource type
    });

    // store in db
    const book = await Book.create({
      title,
      genre,
      coverImage: coverImageUpload.secure_url,
      file: bookPdfUpload.secure_url,
      author: "6622480a7c5bed6d6de14bf4"
    });

    try {
      // Delete the local file after upload (optional)
      fs.promises.unlink(coverImage.path);
      fs.promises.unlink(file.path);
    } catch (error) {
        next(createHttpError(500, "Error while deleting local uploads"))
    }

    res.json({
      message: "Book created successfully!",
      data: book
    });
};

export { createBook };
