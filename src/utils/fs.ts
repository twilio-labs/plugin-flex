import { existsSync, readFileSync, writeFileSync, createReadStream, unlinkSync } from 'fs';
import * as path from 'path';
import crypto from 'crypto';

/**
 * Checks files exist
 * @param files the path to files to check
 * @returns {boolean}
 */
export const filesExist = (...files: string[]): boolean => files.map(existsSync).every(Boolean);

/**
 * Reads and parses a JSON file
 * @param paths
 * @returns {any}
 */
export const readJSONFile = <T extends Record<string, any>>(...paths: string[]): T =>
  JSON.parse(readFileSync(path.join(...paths), 'utf8'));

/**
 * (Templated) reads and parses a JSON file
 * @param paths
 * @returns {any}
 */
export const readJsonFile = <T>(...paths: string[]): T => JSON.parse(readFileSync(path.join(...paths), 'utf8'));

/**
 * Write to a JSON file
 * @param obj
 * @param paths
 */
export const writeJSONFile = (obj: Record<string, any>, ...paths: string[]) =>
  writeFileSync(path.join(...paths), JSON.stringify(obj, null, 2));

/**
 * Calculates the sha of a file
 * @param paths
 */
export const calculateSha256 = async (...paths: string[]) => {
  return new Promise((resolve, reject) => {
    const shasum = crypto.createHash('sha256');
    const stream = createReadStream(path.join(...paths));

    stream.on('data', (data) => shasum.update(data));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(shasum.digest('hex')));
  });
};

/**
 * Removes a file
 * @param paths
 */
export const removeFile = (...paths: string[]) => unlinkSync(path.join(...paths));
