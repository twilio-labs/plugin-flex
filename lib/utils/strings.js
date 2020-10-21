"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullOrUndefined = exports.toSentenceCase = void 0;
const lodash_startcase_1 = __importDefault(require("lodash.startcase"));
const KEY_CASE_OVERWRITE = {
    sid: 'SID',
    datecreated: 'Created',
    dateupdated: 'Updated',
    isprivate: 'Access',
    isactive: 'Status',
    url: 'URL',
};
/**
 * Converts a string from camelCase to Sentence Case
 * @param key
 */
exports.toSentenceCase = (key) => {
    if (key.toLowerCase() in KEY_CASE_OVERWRITE) {
        return KEY_CASE_OVERWRITE[key.toLowerCase()];
    }
    const split = lodash_startcase_1.default(key).split(' ');
    if (split.length <= 1) {
        return split.join(' ');
    }
    return split.map(exports.toSentenceCase).join(' ');
};
/**
 * Returns true if value is null or undefined
 * @param value the value to check
 */
exports.isNullOrUndefined = (value) => value === undefined || value === null;
//# sourceMappingURL=strings.js.map