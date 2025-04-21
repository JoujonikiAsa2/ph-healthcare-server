import { Request, Response, NextFunction } from 'express';

export const notFoundErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
  });
};
