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
const path_1 = require("path");
const os_1 = require("os");
const flex_plugins_utils_spawn_1 = __importDefault(require("flex-plugins-utils-spawn"));
const flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
const flex_plugins_api_toolkit_1 = __importDefault(require("flex-plugins-api-toolkit"));
const cli_core_1 = require("@twilio/cli-core");
const flex_plugins_api_client_1 = require("flex-plugins-api-client");
const flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
const dayjs_1 = __importDefault(require("dayjs"));
const Errors = __importStar(require("@oclif/errors"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const preload_1 = __importDefault(require("semver/preload"));
const parser_1 = __importDefault(require("../utils/parser"));
const flags = __importStar(require("../utils/flags"));
const fs_1 = require("../utils/fs");
const exceptions_1 = require("../exceptions");
const general_1 = require("../utils/general");
const strings_1 = require("../utils/strings");
const prints_1 = __importDefault(require("../prints"));
const commandDocs_json_1 = require("../commandDocs.json");
const FlexConfigurationClient_1 = __importDefault(require("../clients/FlexConfigurationClient"));
const ServerlessClient_1 = __importDefault(require("../clients/ServerlessClient"));
const baseFlag = Object.assign({}, cli_core_1.baseCommands.TwilioClientCommand.flags);
delete baseFlag['cli-output-format'];
/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
class FlexPlugin extends cli_core_1.baseCommands.TwilioClientCommand {
    constructor(argv, config, secureStorage, opts) {
        super(argv, config, secureStorage);
        this.opts = Object.assign(Object.assign({}, FlexPlugin.defaultOptions), opts);
        this.showHeaders = true;
        this.cwd = process.cwd();
        this.pluginRootDir = path_1.join(__dirname, '../../');
        this.cliRootDir = path_1.join(os_1.homedir(), '.twilio-cli');
        this.scriptArgs = process.argv.slice(3);
        this.skipEnvironmentalSetup = false;
        this._logger = new flex_plugins_utils_logger_1.Logger({ isQuiet: false, markdown: true });
        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        this.version = require(path_1.join(this.pluginRootDir, 'package.json')).version;
        if (!this.opts.strict) {
            // @ts-ignore
            this.constructor.strict = false;
        }
        this.exit = general_1.exit;
    }
    /**
     * Returns the version from the package.json if found, otherwise returns undefined
     * @param pkg
     */
    static getPackageVersion(pkg) {
        try {
            // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
            return require(path_1.join(pkg, 'package.json')).version;
        }
        catch (e) {
            return 'undefined';
        }
    }
    /**
     * Returns the formatted header field
     * @param key
     */
    /* istanbul ignore next */
    static getHeader(key) {
        return strings_1.toSentenceCase(key);
    }
    /**
     * Parses the timestamp
     * @param timestamp
     */
    /* istanbul ignore next */
    static parseDate(timestamp) {
        return dayjs_1.default(timestamp).format('MMM DD, YYYY H:mm:ssA');
    }
    /**
     * Returns the formatted value field
     * @param key
     * @param value
     */
    /* istanbul ignore next */
    static getValue(key, value) {
        key = key.toLowerCase();
        if (FlexPlugin.DATE_FIELDS.includes(key)) {
            return `..!!${FlexPlugin.parseDate(value)}!!..`;
        }
        if (FlexPlugin.ACTIVE_FIELDS.includes(key)) {
            return value === true ? 'Active' : 'Inactive';
        }
        if (FlexPlugin.ACCESS_FIELDS.includes(key)) {
            return value === true ? 'Private' : 'Public';
        }
        return value;
    }
    /**
     * Checks the dir is a Flex plugin
     * @returns {boolean}
     */
    isPluginFolder() {
        if (!fs_1.filesExist(this.cwd, 'package.json')) {
            return false;
        }
        const { pkg } = this;
        return ['flex-plugin-scripts', '@twilio/flex-ui'].every((dep) => dep in pkg.dependencies || dep in pkg.devDependencies);
    }
    /**
     * Gets the package.json
     * @returns {object}
     */
    get pkg() {
        return fs_1.readJSONFile(this.cwd, 'package.json');
    }
    /**
     * Returns the major version of flex-plugin-scripts of the package
     */
    get builderVersion() {
        const { pkg } = this;
        const script = pkg.dependencies['flex-plugin-scripts'] || pkg.devDependencies['flex-plugin-scripts'];
        if (!script) {
            return null;
        }
        const version = preload_1.default.coerce(script);
        if (!version) {
            return null;
        }
        return version.major;
    }
    /**
     * Gets an instantiated {@link PluginsApiToolkit}
     * @returns {PluginsApiToolkit}
     */
    get pluginsApiToolkit() {
        if (!this._pluginsApiToolkit) {
            throw new exceptions_1.TwilioCliError('PluginsApiToolkit is not initialized yet');
        }
        return this._pluginsApiToolkit;
    }
    /**
     * Gets an instantiated {@link PluginsClient}
     * @returns {PluginsClient}
     */
    get pluginsClient() {
        if (!this._pluginsClient) {
            throw new exceptions_1.TwilioCliError('PluginsClient is not initialized yet');
        }
        return this._pluginsClient;
    }
    /**
     * Gets an instantiated {@link PluginsClient}
     * @returns {PluginsClient}
     */
    get pluginVersionsClient() {
        if (!this._pluginVersionsClient) {
            throw new exceptions_1.TwilioCliError('PluginVersionsClient is not initialized yet');
        }
        return this._pluginVersionsClient;
    }
    /**
     * Gets an instantiated {@link ConfigurationsClient}
     * @returns {ConfigurationsClient}
     */
    get configurationsClient() {
        if (!this._configurationsClient) {
            throw new exceptions_1.TwilioCliError('ConfigurationsClient is not initialized yet');
        }
        return this._configurationsClient;
    }
    /**
     * Gets an instantiated {@link ReleasesClient}
     * @returns {ReleasesClient}
     */
    get releasesClient() {
        if (!this._releasesClient) {
            throw new exceptions_1.TwilioCliError('ReleasesClient is not initialized yet');
        }
        return this._releasesClient;
    }
    /**
     * Gets an instantiated {@link FlexConfigurationClient}
     * @returns {FlexConfigurationClient}
     */
    get flexConfigurationClient() {
        if (!this._flexConfigurationClient) {
            throw new exceptions_1.TwilioCliError('flexConfigurationClient is not initialized yet');
        }
        return this._flexConfigurationClient;
    }
    /**
     * Gets an instantiated {@link ServerlessClient}
     * @returns {ServerlessClient}
     */
    get serverlessClient() {
        if (!this._serverlessClient) {
            throw new exceptions_1.TwilioCliError('serverlessClient is not initialized yet');
        }
        return this._serverlessClient;
    }
    /**
     * The main run command
     * @override
     */
    async run() {
        await super.run();
        this.logger.debug(`Using Flex Plugins Config File: ${this.pluginsConfigPath}`);
        if (this._flags['clear-terminal']) {
            this._logger.clearTerminal();
        }
        if (this.opts.runInDirectory && !this.isPluginFolder()) {
            throw new exceptions_1.TwilioCliError(`${this.cwd} directory is not a flex plugin directory. You must either run a plugin inside a directory or use the --name flag`);
        }
        const options = {
            caller: 'twilio-cli',
            packages: {
                'flex-plugin-scripts': FlexPlugin.getPackageVersion('flex-plugin-scripts'),
                'flex-plugins-api-utils': FlexPlugin.getPackageVersion('flex-plugins-api-utils'),
                'flex-plugins-api-client': FlexPlugin.getPackageVersion('flex-plugins-api-client'),
                'twilio-cli': FlexPlugin.getPackageVersion('@twilio/cli-core'),
                'twilio-cli-flex-plugin': FlexPlugin.getPackageVersion(this.pluginRootDir),
            },
        };
        if (this._flags.region) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options.realm = this._flags.region;
        }
        const httpClient = new flex_plugins_api_client_1.PluginServiceHTTPClient(this.twilioApiClient.username, this.twilioApiClient.password, options);
        this._pluginsApiToolkit = new flex_plugins_api_toolkit_1.default(this.twilioApiClient.username, this.twilioApiClient.password, options);
        this._pluginsClient = new flex_plugins_api_client_1.PluginsClient(httpClient);
        this._pluginVersionsClient = new flex_plugins_api_client_1.PluginVersionsClient(httpClient);
        this._configurationsClient = new flex_plugins_api_client_1.ConfigurationsClient(httpClient);
        this._releasesClient = new flex_plugins_api_client_1.ReleasesClient(httpClient);
        this._flexConfigurationClient = new FlexConfigurationClient_1.default(this.twilioClient.flexApi.v1.configuration.get());
        this._serverlessClient = new ServerlessClient_1.default(this.twilioClient.serverless.v1.services);
        if (!this.skipEnvironmentalSetup) {
            this.setupEnvironment();
        }
        if (!this.isJson) {
            this._logger.notice(`Using profile **${this.currentProfile.id}** (${this.currentProfile.accountSid})`);
            this._logger.newline();
        }
        const result = await this.doRun();
        if (result && this.isJson && typeof result === 'object') {
            this._logger.info(JSON.stringify(result));
        }
    }
    /**
     * Catches any thrown exception
     * @param error
     */
    async catch(error) {
        if (general_1.instanceOf(error, flex_plugins_utils_exception_1.TwilioError)) {
            this._logger.error(error.message);
        }
        else if (general_1.instanceOf(error, Errors.CLIError)) {
            Errors.error(error.message);
        }
        else {
            super.catch(error);
        }
    }
    /**
     * OClif alias for run command
     * @alias for run
     */
    /* istanbul ignore next */
    async runCommand() {
        return this.run();
    }
    /**
     * Runs a flex-plugin-scripts script
     * @param scriptName  the script name
     * @param argv        arguments to pass to the script
     */
    /* istanbul ignore next */
    async runScript(scriptName, argv = this.scriptArgs) {
        const extra = [];
        if (scriptName !== 'test') {
            extra.push('--core-cwd', this.pluginRootDir);
        }
        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        return require(`flex-plugin-scripts/dist/scripts/${scriptName}`).default(...argv, ...extra);
    }
    /**
     * Spawns a script
     * @param scriptName  the script to spawn
     * @param argv arguments to pass to the script
     */
    /* istanbul ignore next */
    async spawnScript(scriptName, argv = this.scriptArgs) {
        const scriptPath = require.resolve(`flex-plugin-scripts/dist/scripts/${scriptName}`);
        return flex_plugins_utils_spawn_1.default('node', [scriptPath, ...argv, '--run-script', '--core-cwd', this.pluginRootDir]);
    }
    /**
     * Setups the environment. This must run after run command
     */
    setupEnvironment() {
        process.env.SKIP_CREDENTIALS_SAVING = 'true';
        process.env.TWILIO_ACCOUNT_SID = this.twilioClient.username;
        process.env.TWILIO_AUTH_TOKEN = this.twilioClient.password;
    }
    /**
     * Prints pretty an object as a Key:Value pair
     * @param object    the object to print
     * @param ignoreList  the keys in the object to ignore
     */
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    printPretty(object, ...ignoreList) {
        Object.keys(object)
            .filter((key) => !ignoreList.includes(key))
            .forEach((key) => {
            this._logger.info(`..│.. [[${strings_1.toSentenceCase(key)}]]: ${FlexPlugin.getValue(key, object[key])}`);
        });
    }
    /**
     * Prints the key/value pair as a main header
     * @param key the key
     * @param value the value
     */
    /* istanbul ignore next */
    printHeader(key, value) {
        if (value === undefined) {
            this._logger.info(`**[[${FlexPlugin.getHeader(key)}:]]**`);
        }
        else {
            this._logger.info(`**[[${FlexPlugin.getHeader(key)}:]]** ${FlexPlugin.getValue(key, value)}`);
        }
    }
    /**
     * Prints the key/value as a "version" or instance header
     * @param key
     * @param otherKeys
     */
    /* istanbul ignore next */
    printVersion(key, ...otherKeys) {
        if (otherKeys.length) {
            this._logger.info(`**@@${key}@@** ${otherKeys.join('')}`);
        }
        else {
            this._logger.info(`**@@${key}@@**`);
        }
    }
    /**
     * Abstract class method that each command should extend; this is the actual command that runs once initialization is
     * complete
     * @abstract
     * @returns {Promise<void>}
     */
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async doRun() {
        throw new exceptions_1.TwilioCliError('Abstract method must be implemented');
    }
    /**
     * Abstract method for getting the flags
     * @protected
     */
    get _flags() {
        return this.parse(FlexPlugin).flags;
    }
    /**
     * Whether this is a JSON response
     */
    get isJson() {
        return this._flags.json;
    }
    /**
     * Get the cli plugin configuartion
     */
    get pluginsConfig() {
        mkdirp_1.default.sync(path_1.join(this.cliRootDir, 'flex'));
        if (!fs_1.filesExist(this.pluginsConfigPath)) {
            fs_1.writeJSONFile({ plugins: [] }, this.pluginsConfigPath);
        }
        return fs_1.readJsonFile(this.pluginsConfigPath);
    }
    /**
     * Returns the pluginsConfigPath
     */
    get pluginsConfigPath() {
        return path_1.join(this.cliRootDir, 'flex', 'plugins.json');
    }
    /**
     * Configures the success/error print messages
     */
    get _prints() {
        return prints_1.default(this._logger);
    }
    /**
     * The command parse override
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(options, argv = this.argv) {
        return parser_1.default(super.parse)(options, argv);
    }
}
exports.default = FlexPlugin;
FlexPlugin.flags = Object.assign(Object.assign({}, baseFlag), { json: flags.boolean({
        description: commandDocs_json_1.flexPlugin.flags.json,
    }), 'clear-terminal': flags.boolean({
        description: commandDocs_json_1.flexPlugin.flags.clearTerminal,
    }), region: flags.enum({
        options: ['dev', 'stage'],
        default: process.env.TWILIO_REGION,
        hidden: true,
    }) });
FlexPlugin.DATE_FIELDS = ['datecreated', 'dateupdated', 'created', 'updated'];
FlexPlugin.ACTIVE_FIELDS = ['active', 'isactive', 'status'];
FlexPlugin.ACCESS_FIELDS = ['private', 'isprivate'];
FlexPlugin.defaultOptions = {
    strict: true,
    runInDirectory: true,
};
//# sourceMappingURL=flex-plugin.js.map