"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
class TwilioCliError extends flex_plugins_utils_exception_1.TwilioError {
    constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, TwilioCliError.prototype);
    }
}
exports.default = TwilioCliError;
//# sourceMappingURL=TwilioCliError.js.map