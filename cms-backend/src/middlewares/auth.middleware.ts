import { Request, Response, NextFunction } from 'express';

export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    role: 'admin' | 'editor';
    network: string;
  };
}

export const mockAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const role = (req.headers['x-role'] as any) || 'editor';
  const network = (req.headers['x-network'] as any) || '1';

  req.user = {
    id: 'mock-user',
    role,
    network
  };

  next();
};