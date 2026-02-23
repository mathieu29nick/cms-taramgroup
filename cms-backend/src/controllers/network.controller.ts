import { Request, Response } from 'express';
import * as service from '../services/network.service';

export const getNetworks = async (_: Request, res: Response) => {
  const networks = await service.getAllNetworks();
  res.json(networks);
};