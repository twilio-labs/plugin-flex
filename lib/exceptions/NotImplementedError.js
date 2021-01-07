"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class NotImplementedError extends _1.TwilioCliError {
    constructor() {
        super('Abstract method must be implemented');
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}
exports.default = NotImplementedError;
//# sourceMappingURL=NotImplementedError.js.map