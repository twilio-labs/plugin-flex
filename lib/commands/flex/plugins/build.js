"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const commandDocs_json_1 = require("../../../commandDocs.json");
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Builds the the plugin bundle
 */
class FlexPluginsBuild extends flex_plugin_1.default {
    /**
     * @override
     */
    async doRun() {
        process.env.PERSIST_TERMINAL = 'true';
        await this.runScript('pre-script-check');
        await this.runScript('build');
    }
    get _flags() {
        return this.parse(FlexPluginsBuild).flags;
    }
    /**
     * @override
     */
    get checkCompatibility() {
        return true;
    }
}
exports.default = FlexPluginsBuild;
FlexPluginsBuild.description = general_1.createDescription(commandDocs_json_1.build.description, true);
FlexPluginsBuild.flags = Object.assign({}, flex_plugin_1.default.flags);
//# sourceMappingURL=build.js.map