import{ NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../utils/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.json({
    message: err.message,
    errorStack: config.node_env == "development" ? err.stack : "",
  });
};

export default globalErrorHandler;
