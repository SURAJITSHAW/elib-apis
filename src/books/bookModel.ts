import mongoose from "mongoose";

// Define the book schema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String, // You might store the URL to the cover photo
      required: true,
    },
    file: {
        type: String, // You might store the path to the book file
        required: true,
    },
  },
  { timestamps: true }
);

// Create the book model
const Book = mongoose.model("Book", bookSchema);

export default Book;
