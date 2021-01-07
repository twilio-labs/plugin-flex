"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Prints error about incompatibility
 */
const incompatibleVersion = (logger) => (name, version) => {
    logger.error(`The plugin ${name} version (v${version}) is not compatible with this CLI command.`);
    logger.newline();
    logger.info('Run {{$ twilio flex:plugins:upgrade-plugin \\-\\-beta \\-\\-install}} to upgrade your plugin.');
};
exports.default = (logger) => ({
    incompatibleVersion: incompatibleVersion(logger),
});
//# sourceMappingURL=flexPlugin.js.map