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
exports.descriptionFlag = exports.pluginFlag = exports.nameFlag = void 0;
const flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
const flags = __importStar(require("../utils/flags"));
const flex_plugin_1 = __importDefault(require("./flex-plugin"));
const commandDocs_json_1 = require("../commandDocs.json");
exports.nameFlag = {
    description: commandDocs_json_1.createConfiguration.flags.name,
    default: `Autogenerated Release ${Date.now()}`,
    required: true,
    max: 100,
};
exports.pluginFlag = {
    description: commandDocs_json_1.createConfiguration.flags.plugin,
    multiple: true,
    required: true,
};
exports.descriptionFlag = {
    description: commandDocs_json_1.createConfiguration.flags.description,
    default: commandDocs_json_1.createConfiguration.defaults.description,
    required: true,
    max: 500,
};
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Creates a Configuration
 */
class CreateConfiguration extends flex_plugin_1.default {
    /**
     * Performs the actual task of validating and creating configuration. This method is also usd by release script.
     */
    async doCreateConfiguration() {
        return flex_plugins_utils_logger_1.progress(`Creating configuration`, async () => this.createConfiguration(), false);
    }
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    async createConfiguration() {
        const option = {
            name: this._flags.name,
            addPlugins: this._flags.plugin,
            description: this._flags.description || '',
        };
        if (!this._flags.new) {
            option.fromConfiguration = 'active';
        }
        return this.pluginsApiToolkit.createConfiguration(option);
    }
    get _flags() {
        return this.parse(CreateConfiguration).flags;
    }
}
exports.default = CreateConfiguration;
CreateConfiguration.flags = Object.assign(Object.assign({}, baseFlags), { new: flags.boolean({
        description: commandDocs_json_1.createConfiguration.flags.new,
    }), name: flags.string(exports.nameFlag), plugin: flags.string(exports.pluginFlag), description: flags.string(exports.descriptionFlag) });
//# sourceMappingURL=create-configuration.js.map