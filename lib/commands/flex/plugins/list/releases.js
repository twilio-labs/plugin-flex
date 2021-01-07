"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../../utils/general");
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
const commandDocs_json_1 = require("../../../../commandDocs.json");
/**
 * Lists the Flex Plugin Releases
 */
class FlexPluginsListPlugins extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        const result = await this.pluginsApiToolkit.listReleases({});
        return result.releases;
    }
    /**
     * @override
     */
    notFound() {
        this._logger.info(`!!No releases where not found.!!`);
    }
    /**
     * @override
     */
    print(releases) {
        releases.forEach((release) => {
            this.printVersion(release.sid);
            this.printPretty(release);
            this._logger.newline();
        });
    }
}
exports.default = FlexPluginsListPlugins;
FlexPluginsListPlugins.description = general_1.createDescription(commandDocs_json_1.listReleases.description, false);
FlexPluginsListPlugins.flags = Object.assign({}, information_flex_plugin_1.default.flags);
//# sourceMappingURL=releases.js.map