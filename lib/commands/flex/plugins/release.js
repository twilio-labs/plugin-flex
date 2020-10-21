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
Object.defineProperty(exports, "__esModule", { value: true });
const flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
const command_1 = require("@oclif/command");
const errors_1 = require("@oclif/parser/lib/errors");
const general_1 = require("../../../utils/general");
const create_configuration_1 = __importStar(require("../../../sub-commands/create-configuration"));
const commandDocs_json_1 = require("../../../commandDocs.json");
/**
 * Creates a Flex Plugin Configuration and releases and sets it to active
 */
class FlexPluginsRelease extends create_configuration_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { runInDirectory: false });
        this.scriptArgs = [];
        this.prints = this._prints.release;
    }
    /**
     * @override
     */
    async doRun() {
        if (this._flags['configuration-sid']) {
            await this.doCreateRelease(this._flags['configuration-sid']);
        }
        else {
            const config = await super.doCreateConfiguration();
            await this.doCreateRelease(config.sid);
        }
    }
    async doCreateRelease(configurationSid) {
        await flex_plugins_utils_logger_1.progress(`Enabling configuration **${configurationSid}**`, async () => this.createRelease(configurationSid), false);
        this.prints.releaseSuccessful(configurationSid);
    }
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    async createRelease(configurationSid) {
        return this.pluginsApiToolkit.release({ configurationSid });
    }
    get _flags() {
        const parse = this.parse(FlexPluginsRelease);
        if (parse.flags['configuration-sid']) {
            return parse.flags;
        }
        ['plugin', 'description', 'name'].forEach((key) => {
            if (!parse.flags[key]) {
                throw new errors_1.RequiredFlagError({
                    flag: FlexPluginsRelease.flags[key],
                    parse: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        input: {},
                        output: parse,
                    },
                });
            }
        });
        return parse.flags;
    }
}
exports.default = FlexPluginsRelease;
FlexPluginsRelease.description = general_1.createDescription(commandDocs_json_1.release.description, false);
FlexPluginsRelease.flags = Object.assign(Object.assign({}, create_configuration_1.default.flags), { 'configuration-sid': command_1.flags.string({
        description: commandDocs_json_1.release.flags.configurationSid,
        exclusive: ['description', 'name', 'new'],
    }), name: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.nameFlag), { required: false, exclusive: ['configuration-sid'] })), plugin: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.pluginFlag), { required: false, exclusive: ['configuration-sid'] })), description: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.descriptionFlag), { required: false, exclusive: ['configuration-sid'] })) });
//# sourceMappingURL=release.js.map