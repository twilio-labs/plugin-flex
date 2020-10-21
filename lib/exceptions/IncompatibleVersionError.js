"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TwilioCliError_1 = __importDefault(require("./TwilioCliError"));
class IncompatibleVersionError extends TwilioCliError_1.default {
    constructor(name, version) {
        super(`The plugin ${name} version (v${version}) is not compatible with this CLI command.`);
        Object.setPrototypeOf(this, IncompatibleVersionError.prototype);
    }
}
exports.default = IncompatibleVersionError;
//# sourceMappingURL=IncompatibleVersionError.js.map