import express from 'express';
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from './users/userRouter';

const app = express();

// ! middlewares
app.use(express.json());

// ! Routes
app.get("/test", (req, res, next) => {

    const error = createHttpError(400, "Manual error")
    next(error)

    res.json({
        message: "Testing successfull!"
    })
})
app.use("/api/users", userRouter)

// ! Global errors
app.use(globalErrorHandler);

export default app;