"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const parser_1 = require("@oclif/parser");
const start_1 = require("flex-plugin-scripts/dist/scripts/start");
const pre_script_check_1 = require("flex-plugin-scripts/dist/scripts/pre-script-check");
const semver_1 = __importDefault(require("semver"));
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const fs_1 = require("../../../utils/fs");
const exceptions_1 = require("../../../exceptions");
const commandDocs_json_1 = require("../../../commandDocs.json");
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
const MULTI_PLUGINS_PILOT = pre_script_check_1.FLAG_MULTI_PLUGINS.substring(2);
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
class FlexPluginsStart extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { strict: false });
        if (this._flags['include-remote'] || this._flags.name) {
            this.opts.runInDirectory = false;
        }
    }
    /**
     * @override
     */
    async doRun() {
        const flexArgs = [];
        const pluginNames = [];
        if (this._flags.name) {
            for (const name of this._flags.name) {
                flexArgs.push('--name', name);
                if (!name.includes('@remote')) {
                    pluginNames.push(name);
                }
            }
        }
        if (this._flags['include-remote']) {
            flexArgs.push('--include-remote');
        }
        // If running in a plugin directory, append it to the names
        if (this.isPluginFolder() && !flexArgs.includes(this.pkg.name)) {
            flexArgs.push('--name', this.pkg.name);
            pluginNames.push(this.pkg.name);
        }
        if (!pluginNames.length) {
            throw new exceptions_1.TwilioCliError('You must run at least one local plugin. To view all remote plugins, go to flex.twilio.com.');
        }
        let flexStartScript = { port: 3000 };
        if (flexArgs.length && pluginNames.length) {
            // Verify all plugins are correct
            for (let i = 0; pluginNames && i < pluginNames.length; i++) {
                await this.checkPlugin(pluginNames[i]);
            }
            // Start flex start once
            flexStartScript = await this.runScript('start', ['flex', ...flexArgs]);
            // Now spawn each plugin as a separate process
            for (let i = 0; pluginNames && i < pluginNames.length; i++) {
                const port = await start_1.findPortAvailablePort('--port', (flexStartScript.port + (i + 1) * 100).toString());
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.spawnScript('start', ['plugin', '--name', pluginNames[i], '--port', port.toString()]);
            }
        }
    }
    /**
     * Checks the plugin
     * @param pluginName  the plugin name
     */
    async checkPlugin(pluginName) {
        await this.runScript('pre-script-check', ['--name', pluginName]);
        await this.runScript('pre-start-check', ['--name', pluginName]);
        // read cli plugins json to get directory
        const plugin = this.pluginsConfig.plugins.find((p) => p.name === pluginName);
        if (!plugin) {
            throw new exceptions_1.TwilioCliError(`The plugin ${pluginName} was not found.`);
        }
        // Verify plugin's flex-plugin-scripts is v4
        const pkgDir = `${plugin.dir}/package.json`;
        const pkg = fs_1.readJSONFile(pkgDir);
        let scriptVersion = semver_1.default.coerce(pkg.dependencies['flex-plugin-scripts']);
        if (!scriptVersion) {
            scriptVersion = semver_1.default.coerce(pkg.devDependencies['flex-plugin-scripts']);
        }
        if (scriptVersion === null || scriptVersion.major !== 4) {
            throw new exceptions_1.IncompatibleVersionError(pluginName, scriptVersion === null || scriptVersion === void 0 ? void 0 : scriptVersion.major);
        }
    }
    /**
     * Parses the flags passed to this command
     */
    get _flags() {
        return this.parse(FlexPluginsStart).flags;
    }
}
exports.default = FlexPluginsStart;
FlexPluginsStart.description = general_1.createDescription(commandDocs_json_1.start.description, false);
FlexPluginsStart.flags = Object.assign(Object.assign({}, baseFlags), { name: command_1.flags.string({
        description: commandDocs_json_1.start.flags.name,
        multiple: true,
    }), [MULTI_PLUGINS_PILOT]: command_1.flags.boolean({
        description: commandDocs_json_1.start.flags.multiPluginsPilot,
    }), 'include-remote': command_1.flags.boolean({
        description: commandDocs_json_1.start.flags.includeRemote,
        hidden: true,
    }) });
try {
    const parsed = parser_1.parse(process.argv.splice(3), Object.assign(Object.assign({}, FlexPluginsStart), { strict: false }));
    if (parsed.flags[MULTI_PLUGINS_PILOT]) {
        delete FlexPluginsStart.flags['include-remote'].hidden;
        FlexPluginsStart.flags.name.description = commandDocs_json_1.start.flags.nameMultiPlugins;
    }
}
catch (_a) {
    // No-op
}
//# sourceMappingURL=start.js.map