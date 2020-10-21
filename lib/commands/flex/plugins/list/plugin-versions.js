"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const general_1 = require("../../../../utils/general");
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
const flex_plugin_1 = __importDefault(require("../../../../sub-commands/flex-plugin"));
const commandDocs_json_1 = require("../../../../commandDocs.json");
/**
 * Lists the Flex Plugin Versions
 */
class FlexPluginsListPluginVersions extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        const result = await this.pluginsApiToolkit.listPluginVersions({ name: this._flags.name });
        return result.plugin_versions;
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
    print(versions) {
        const list = this.sortByActive(versions);
        this.printHeader('Plugin Name', this._flags.name);
        if (list.length) {
            this.printHeader('Plugin SID', list[0].pluginSid);
        }
        this._logger.newline();
        this.printHeader('Versions');
        list.forEach((version) => {
            this.printVersion(version.version, version.isActive ? '(Active)' : '');
            this.printPretty(version, 'isActive', 'pluginSid', 'version');
            this._logger.newline();
        });
    }
    /**
     * Parses the flags passed to this command
     */
    get _flags() {
        return this.parse(FlexPluginsListPluginVersions).flags;
    }
}
exports.default = FlexPluginsListPluginVersions;
FlexPluginsListPluginVersions.description = general_1.createDescription(commandDocs_json_1.listPluginVersions.description, false);
FlexPluginsListPluginVersions.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { name: command_1.flags.string({
        description: commandDocs_json_1.listPluginVersions.flags.name,
        required: true,
    }) });
//# sourceMappingURL=plugin-versions.js.map