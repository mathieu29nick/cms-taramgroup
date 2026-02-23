import { readJSON } from '../utils/file';

export const getAllNetworks = async () =>
  readJSON('networks.json');