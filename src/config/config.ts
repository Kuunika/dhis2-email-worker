import { config, DotenvParseOutput } from 'dotenv';
import { existsSync } from 'fs';
import { CheckConfigFile, LoadConfig, Path } from './types';
import { FileNotFound } from './error';

/**
 * Load environment variables
 *
 * @param { string } path - Environment variable path.
 * @returns { DotenvParseOutput } - environment variables
 */
export const loadConfig: LoadConfig = async (
  path: Path
): Promise<DotenvParseOutput> => {
  checkConfigFile(path);

  const { error, parsed } = await config({ path });
  if (error) {
    throw new Error(error.message);
  }

  return parsed;
};

const checkConfigFile: CheckConfigFile = (path: Path): void => {
  if (!existsSync(path)) {
    throw new FileNotFound('File Not Found');
  }
};
