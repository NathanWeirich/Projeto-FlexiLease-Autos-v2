import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.status || 500;
  const status = err.status ? err.status : "Internal Server Error";
  const message = err.message || "Ocorreu um erro inesperado.";
  const details = err.details || [];

  res.status(statusCode).json({
    code: statusCode,
    status,
    message,
    details,
  });
};
