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
exports.parseVersionInput = void 0;
const flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
const semver_1 = __importDefault(require("semver"));
const errors_1 = require("@oclif/parser/lib/errors");
const flags = __importStar(require("../../../utils/flags"));
const exceptions_1 = require("../../../exceptions");
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const commandDocs_json_1 = require("../../../commandDocs.json");
const ServerlessClient_1 = __importDefault(require("../../../clients/ServerlessClient"));
/**
 * Parses the version input
 * @param input
 */
exports.parseVersionInput = (input) => {
    if (!semver_1.default.valid(input)) {
        const message = `Flag --version=${input} must be a valid SemVer`;
        throw new errors_1.CLIParseError({ parse: {}, message });
    }
    if (input === '0.0.0') {
        const message = `Flag --version=${input} cannot be 0.0.0`;
        throw new errors_1.CLIParseError({ parse: {}, message });
    }
    return input;
};
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Builds and then deploys the Flex Plugin
 */
class FlexPluginsDeploy extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, {});
        this.nextVersion = undefined;
        this.scriptArgs = [];
        this.prints = this._prints.deploy;
    }
    /**
     * @override
     */
    async doRun() {
        await this.checkServerlessInstance();
        await this.checkForLegacy();
        const args = ['--quiet', '--persist-terminal'];
        const name = `**${this.pkg.name}**`;
        await flex_plugins_utils_logger_1.progress(`Validating deployment of plugin ${name}`, async () => this.validatePlugin(), false);
        await flex_plugins_utils_logger_1.progress(`Compiling a production build of ${name}`, async () => {
            await this.runScript('pre-script-check', args);
            const buildArgs = [...args];
            if (this.nextVersion) {
                buildArgs.push('--version', this.nextVersion);
            }
            return this.runScript('build', [...buildArgs]);
        }, false);
        const deployedData = await flex_plugins_utils_logger_1.progress(`Uploading ${name}`, async () => this.runScript('deploy', [...this.scriptArgs, ...args]), false);
        await flex_plugins_utils_logger_1.progress(`Registering plugin ${name} with Plugins API`, async () => this.registerPlugin(), false);
        const pluginVersion = await flex_plugins_utils_logger_1.progress(`Registering version **v${deployedData.nextVersion}** with Plugins API`, async () => this.registerPluginVersion(deployedData), false);
        this.prints.deploySuccessful(this.pkg.name, pluginVersion.private ? 'private' : 'public', deployedData);
    }
    /**
     * Validates that the provided next plugin version is valid
     * @returns {Promise<void>}
     */
    async validatePlugin() {
        let currentVersion = '0.0.0';
        try {
            // Plugin may not exist yet
            await this.pluginsClient.get(this.pkg.name);
            const pluginVersion = await this.pluginVersionsClient.latest(this.pkg.name);
            currentVersion = (pluginVersion && pluginVersion.version) || '0.0.0';
        }
        catch (e) {
            // No-op - no plugin exists yet; we'll create it later.
        }
        const nextVersion = this._flags.version || semver_1.default.inc(currentVersion, this.bumpLevel);
        if (!semver_1.default.valid(nextVersion)) {
            throw new exceptions_1.TwilioCliError(`${nextVersion} is not a valid semver`);
        }
        if (!semver_1.default.gt(nextVersion, currentVersion)) {
            throw new exceptions_1.TwilioCliError(`The provided version ${nextVersion} must be greater than ${currentVersion}`);
        }
        // Set the plugin version
        this.nextVersion = nextVersion;
        this.scriptArgs.push('version', nextVersion);
        this.scriptArgs.push('--pilot-plugins-api');
        if (this._flags.public) {
            this.scriptArgs.push('--public');
        }
        return {
            currentVersion,
            nextVersion,
        };
    }
    /**
     * Registers a plugin with Plugins API
     * @returns {Promise}
     */
    async registerPlugin() {
        return this.pluginsClient.upsert({
            UniqueName: this.pkg.name,
            FriendlyName: this.pkg.name,
            Description: this._flags.description || '',
        });
    }
    /**
     * Registers a Plugin Version
     * @param deployResult
     * @returns {Promise}
     */
    async registerPluginVersion(deployResult) {
        return this.pluginVersionsClient.create(this.pkg.name, {
            Version: deployResult.nextVersion,
            PluginUrl: deployResult.pluginUrl,
            Private: !deployResult.isPublic,
            Changelog: this._flags.changelog || '',
        });
    }
    /**
     * Checks whether a Serverless instance exists or not. If not, will create one
     */
    async checkServerlessInstance() {
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (serviceSid) {
            try {
                const service = await this.serverlessClient.getService(serviceSid);
                if (service.friendlyName !== ServerlessClient_1.default.NewService.friendlyName) {
                    await this.serverlessClient.updateServiceName(serviceSid);
                }
                return;
            }
            catch (e) {
                if (!general_1.instanceOf(e, exceptions_1.TwilioCliError)) {
                    throw e;
                }
                await this.flexConfigurationClient.unregisterServerlessSid(serviceSid);
            }
        }
        const service = await this.serverlessClient.getOrCreateDefaultService();
        await this.flexConfigurationClient.registerServerlessSid(service.sid);
    }
    /**
     * Checks to see if a legacy plugin exist
     */
    async checkForLegacy() {
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (serviceSid) {
            const hasLegacy = await this.serverlessClient.hasLegacy(serviceSid, this.pkg.name);
            if (hasLegacy) {
                this.prints.warnHasLegacy();
            }
        }
    }
    /**
     * Finds the version bump level
     * @returns {string}
     */
    get bumpLevel() {
        if (this._flags.major) {
            return 'major';
        }
        if (this._flags.minor) {
            return 'minor';
        }
        return 'patch';
    }
    /* istanbul ignore next */
    get _flags() {
        return this.parse(FlexPluginsDeploy).flags;
    }
    /**
     * @override
     */
    get checkCompatibility() {
        return true;
    }
}
exports.default = FlexPluginsDeploy;
FlexPluginsDeploy.description = general_1.createDescription(commandDocs_json_1.deploy.description, true);
FlexPluginsDeploy.flags = Object.assign(Object.assign({}, baseFlags), { patch: flags.boolean({
        description: commandDocs_json_1.deploy.flags.patch,
        exclusive: ['minor', 'major', 'version'],
    }), minor: flags.boolean({
        description: commandDocs_json_1.deploy.flags.minor,
        exclusive: ['patch', 'major', 'version'],
    }), major: flags.boolean({
        description: commandDocs_json_1.deploy.flags.major,
        exclusive: ['patch', 'minor', 'version'],
    }), version: flags.string({
        description: commandDocs_json_1.deploy.flags.version,
        exclusive: ['patch', 'minor', 'major'],
        parse: exports.parseVersionInput,
    }), public: flags.boolean({
        description: commandDocs_json_1.deploy.flags.public,
        default: false,
    }), changelog: flags.string({
        description: commandDocs_json_1.deploy.flags.changelog,
        required: true,
        max: 1000,
    }), description: flags.string({
        description: commandDocs_json_1.deploy.flags.description,
        max: 500,
    }) });
//# sourceMappingURL=deploy.js.map