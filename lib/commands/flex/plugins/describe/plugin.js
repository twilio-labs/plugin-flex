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
 * Describe the Flex Plugin
 */
class FlexPluginsDescribePlugin extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        return this.pluginsApiToolkit.describePlugin({ name: this._flags.name });
    }
    /**
     * @override
     */
    notFound() {
        this._logger.info(`!!Plugin **${this._flags.name}** was not found.!!`);
    }
    /**
     * @override
     */
    print(plugin) {
        this.printHeader('SID', plugin.sid);
        this.printHeader('Name', plugin.name);
        this.printHeader('Status', plugin.isActive);
        this.printHeader('Friendly Name', plugin.friendlyName);
        this.printHeader('Description', plugin.description);
        this.printHeader('Created', plugin.dateCreated);
        this.printHeader('Updated', plugin.dateUpdated);
        this._logger.newline();
        this.printHeader('Versions');
        this.sortByActive(plugin.versions).forEach((version) => {
            const isActive = version.isActive ? '(Active)' : '';
            this.printVersion(version.version, isActive);
            this.printPretty(version, 'isActive');
            this._logger.newline();
        });
    }
    /**
     * Parses the flags passed to this command
     */
    get _flags() {
        return this.parse(FlexPluginsDescribePlugin).flags;
    }
}
exports.default = FlexPluginsDescribePlugin;
FlexPluginsDescribePlugin.description = general_1.createDescription(commandDocs_json_1.describePlugin.description, false);
FlexPluginsDescribePlugin.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { name: command_1.flags.string({
        description: commandDocs_json_1.describePlugin.flags.name,
        required: true,
    }) });
//# sourceMappingURL=plugin.js.map