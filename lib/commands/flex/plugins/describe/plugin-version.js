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
 * Describes Flex Plugin Version
 */
class FlexPluginsDescribePluginVersion extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        const { name, version } = this._flags;
        return this.pluginsApiToolkit.describePluginVersion({ name, version });
    }
    /**
     * @override
     */
    notFound() {
        const { name, version } = this._flags;
        this._logger.info(`!!Plugin **${name}@${version}** was not found.!!`);
    }
    /**
     * @override
     */
    print(version) {
        this.printHeader('SID', version.sid);
        this.printHeader('Plugin SID', version.plugin.sid);
        this.printHeader('Name', version.plugin.name);
        this.printHeader('Version', version.version);
        this.printHeader('Friendly Name', version.plugin.friendlyName);
        this.printHeader('Description', version.plugin.description);
        this.printHeader('Status', version.isActive);
        this.printHeader('Url', version.url);
        this.printHeader('Changelog', version.changelog);
        this.printHeader('Private', version.isPrivate);
        this.printHeader('Created', version.dateCreated);
    }
    /**
     * Parses the flags passed to this command
     */
    get _flags() {
        return this.parse(FlexPluginsDescribePluginVersion).flags;
    }
}
exports.default = FlexPluginsDescribePluginVersion;
FlexPluginsDescribePluginVersion.description = general_1.createDescription(commandDocs_json_1.describePluginVersion.description, false);
FlexPluginsDescribePluginVersion.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { name: command_1.flags.string({
        description: commandDocs_json_1.describePluginVersion.flags.name,
        required: true,
    }), version: command_1.flags.string({
        description: commandDocs_json_1.describePluginVersion.flags.version,
        required: true,
    }) });
//# sourceMappingURL=plugin-version.js.map