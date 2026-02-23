import fs from 'fs/promises';
import path from 'path';

const getPath = (file: string) =>
  path.join(__dirname, '..', 'data', file);

export const readJSON = async (file: string) => {
  const data = await fs.readFile(getPath(file), 'utf-8');
  return JSON.parse(data);
};

export const writeJSON = async (file: string, data: any) => {
  await fs.writeFile(getPath(file), JSON.stringify(data, null, 2));
};