"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const general_1 = require("../../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../../sub-commands/flex-plugin"));
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
const commandDocs_json_1 = require("../../../../commandDocs.json");
/**
 * Describes the Flex Plugin Configuration
 */
class FlexPluginsDescribeConfiguration extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        return this.pluginsApiToolkit.describeConfiguration({ sid: this._flags.sid });
    }
    /**
     * @override
     */
    notFound() {
        this._logger.info(`!!Configuration **${this._flags.sid}** was not found.!!`);
    }
    /**
     * @override
     */
    print(configuration) {
        this.printHeader('SID', configuration.sid);
        this.printHeader('Name', configuration.name);
        this.printHeader('Status', configuration.isActive);
        this.printHeader('Description', configuration.description);
        this.printHeader('Created', configuration.dateCreated);
        this._logger.newline();
        this.printHeader('Plugins');
        configuration.plugins.forEach((plugin) => {
            this.printVersion(plugin.name);
            this.printPretty(plugin, 'version', 'name');
            this._logger.newline();
        });
    }
    /**
     * Parses the flags passed to this command
     */
    get _flags() {
        return this.parse(FlexPluginsDescribeConfiguration).flags;
    }
}
exports.default = FlexPluginsDescribeConfiguration;
FlexPluginsDescribeConfiguration.description = general_1.createDescription(commandDocs_json_1.describeConfiguration.description, false);
FlexPluginsDescribeConfiguration.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { sid: command_1.flags.string({
        description: commandDocs_json_1.describeConfiguration.flags.sid,
        required: true,
    }) });
//# sourceMappingURL=configuration.js.map