"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
const general_1 = require("../../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../../sub-commands/flex-plugin"));
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
const commandDocs_json_1 = require("../../../../commandDocs.json");
/**
 * Describes the Flex Plugin Release
 */
class FlexPluginsDescribeRelease extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        if (this._flags.active) {
            const release = await this.releasesClient.active();
            if (!release) {
                throw new flex_plugins_utils_exception_1.TwilioApiError(20404, 'No active release was found', 404);
            }
            return this.pluginsApiToolkit.describeRelease({ sid: release === null || release === void 0 ? void 0 : release.sid });
        }
        return this.pluginsApiToolkit.describeRelease({ sid: this._flags.sid });
    }
    /**
     * @override
     */
    notFound() {
        this._logger.info(`!!Release **${this._flags.sid || 'active'}** was not found.!!`);
    }
    /**
     * @override
     */
    print(release) {
        this.printHeader('Sid', release.sid);
        this.printHeader('Status', release.isActive);
        this.printHeader('Created', release.dateCreated);
        this._logger.newline();
        this.printHeader('Configuration');
        this.printPretty(release.configuration, 'isActive', 'plugins');
        this._logger.newline();
        this.printHeader('Plugins');
        if (release.configuration.plugins.length === 0) {
            this._logger.info('There are no active plugins');
        }
        release.configuration.plugins.forEach((plugin) => {
            this.printVersion(plugin.name);
            this.printPretty(plugin);
            this._logger.newline();
        });
    }
    /**
     * Parses the flags passed to this command
     */
    get _flags() {
        return this.parse(FlexPluginsDescribeRelease).flags;
    }
}
exports.default = FlexPluginsDescribeRelease;
FlexPluginsDescribeRelease.description = general_1.createDescription(commandDocs_json_1.describeRelease.description, false);
FlexPluginsDescribeRelease.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { sid: command_1.flags.string({
        description: commandDocs_json_1.describeRelease.flags.sid,
        exclusive: ['active'],
    }), active: command_1.flags.boolean({
        description: commandDocs_json_1.describeRelease.flags.active,
        exclusive: ['sid'],
    }) });
//# sourceMappingURL=release.js.map