"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const commandDocs_json_1 = require("../../../commandDocs.json");
const exceptions_1 = require("../../../exceptions");
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Builds the the plugin bundle
 */
class FlexPluginsTest extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { strict: false });
    }
    /**
     * @override
     */
    async doRun() {
        if (this.builderVersion !== 4) {
            throw new exceptions_1.IncompatibleVersionError(this.pkg.name, this.builderVersion);
        }
        process.env.PERSIST_TERMINAL = 'true';
        await this.runScript('pre-script-check');
        await this.runScript('test', ['--env=jsdom']);
    }
}
exports.default = FlexPluginsTest;
FlexPluginsTest.description = general_1.createDescription(commandDocs_json_1.test.description, true);
FlexPluginsTest.flags = Object.assign({}, baseFlags);
//# sourceMappingURL=test.js.map