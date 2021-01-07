"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFile = exports.removeFile = exports.calculateSha256 = exports.writeJSONFile = exports.writeFile = exports.readJsonFile = exports.readJSONFile = exports.readFile = exports.fileExists = exports.filesExist = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Checks files exist
 * @param files the path to files to check
 * @returns {boolean}
 */
exports.filesExist = (...files) => files.map(fs_1.existsSync).every(Boolean);
/**
 * Checks whether a file exists or not
 * @param paths
 */
exports.fileExists = (...paths) => fs_1.existsSync(path.join(...paths));
/**
 * Reads a file
 * @param paths
 */
exports.readFile = (...paths) => fs_1.readFileSync(path.join(...paths), 'utf8');
/**
 * Reads and parses a JSON file
 * @param paths
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.readJSONFile = (...paths) => JSON.parse(exports.readFile(...paths));
/**
 * (Templated) reads and parses a JSON file
 */
exports.readJsonFile = (...paths) => JSON.parse(fs_1.readFileSync(path.join(...paths), 'utf8'));
/**
 * Writes string to file
 */
exports.writeFile = (str, ...paths) => fs_1.writeFileSync(path.join(...paths), str);
/**
 * Write to a JSON file
 * @param obj
 * @param paths
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.writeJSONFile = (obj, ...paths) => fs_1.writeFileSync(path.join(...paths), JSON.stringify(obj, null, 2));
/**
 * Calculates the sha of a file
 * @param paths
 */
exports.calculateSha256 = async (...paths) => {
    return new Promise((resolve, reject) => {
        const shasum = crypto_1.default.createHash('sha256');
        const stream = fs_1.createReadStream(path.join(...paths));
        stream.on('data', (data) => shasum.update(data));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(shasum.digest('hex')));
    });
};
/**
 * Removes a file
 * @param paths
 */
exports.removeFile = (...paths) => fs_1.unlinkSync(path.join(...paths));
/**
 * Copies from from src to dest
 * @param srcPaths
 * @param destPaths
 */
exports.copyFile = (srcPaths, destPaths) => fs_1.copyFileSync(path.join(...srcPaths), path.join(...destPaths));
//# sourceMappingURL=fs.js.map