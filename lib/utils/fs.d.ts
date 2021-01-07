/**
 * Checks files exist
 * @param files the path to files to check
 * @returns {boolean}
 */
export declare const filesExist: (...files: string[]) => boolean;
/**
 * Checks whether a file exists or not
 * @param paths
 */
export declare const fileExists: (...paths: string[]) => boolean;
/**
 * Reads a file
 * @param paths
 */
export declare const readFile: (...paths: string[]) => string;
/**
 * Reads and parses a JSON file
 * @param paths
 */
export declare const readJSONFile: <T extends Record<string, any>>(...paths: string[]) => T;
/**
 * (Templated) reads and parses a JSON file
 */
export declare const readJsonFile: <T>(...paths: string[]) => T;
/**
 * Writes string to file
 */
export declare const writeFile: (str: string, ...paths: string[]) => void;
/**
 * Write to a JSON file
 * @param obj
 * @param paths
 */
export declare const writeJSONFile: (obj: Record<string, any>, ...paths: string[]) => void;
/**
 * Calculates the sha of a file
 * @param paths
 */
export declare const calculateSha256: (...paths: string[]) => Promise<unknown>;
/**
 * Removes a file
 * @param paths
 */
export declare const removeFile: (...paths: string[]) => void;
/**
 * Copies from from src to dest
 * @param srcPaths
 * @param destPaths
 */
export declare const copyFile: (srcPaths: string[], destPaths: string[]) => void;
