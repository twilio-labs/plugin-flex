"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const package_json_1 = __importDefault(require("package-json"));
const flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
const parser_1 = require("@oclif/parser");
const flex_plugins_utils_spawn_1 = __importDefault(require("flex-plugins-utils-spawn"));
const flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const general_1 = require("../../../utils/general");
const commandDocs_json_1 = require("../../../commandDocs.json");
const exceptions_1 = require("../../../exceptions");
const fs_1 = require("../../../utils/fs");
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
class FlexPluginsUpgradePlugin extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, {});
        this.prints = this._prints.upgradePlugin;
        this.parse(FlexPluginsUpgradePlugin);
    }
    /**
     * @override
     */
    async doRun() {
        if (this._flags['remove-legacy-plugin']) {
            await this.removeLegacyPlugin();
            this.prints.removeLegacyPluginSucceeded(this.pkg.name);
            return;
        }
        await this.prints.upgradeNotification(this._flags.yes);
        if (this.pkgVersion === 1) {
            await this.upgradeFromV1();
            return;
        }
        if (this.pkgVersion === 2) {
            await this.upgradeFromV2();
            return;
        }
        if (this.pkgVersion === 3) {
            await this.upgradeFromV3();
            return;
        }
        await this.upgradeToLatest();
    }
    /**
     * Upgrade from v1 to v4
     */
    async upgradeFromV1() {
        this.prints.scriptStarted('v1');
        await this.cleanupScaffold();
        await this.updatePackageJson(this.getDependencyUpdates(), (pkg) => {
            delete pkg['config-overrides-path'];
            return pkg;
        });
        await this.removePackageScripts([
            { name: 'build', it: 'react-app-rewired build' },
            { name: 'eject', it: 'react-app-rewired eject' },
            { name: 'start', it: 'react-app-rewired start', pre: 'flex-check-start' },
            { name: 'test', it: 'react-app-rewired test --env=jsdom' },
        ]);
        await this.npmInstall();
        this.prints.scriptSucceeded(!this._flags.install);
    }
    /**
     * Upgrade from v2 to v4
     */
    async upgradeFromV2() {
        this.prints.scriptStarted('v2');
        await this.cleanupScaffold();
        await this.updatePackageJson(this.getDependencyUpdates(), (pkg) => {
            delete pkg['config-overrides-path'];
            return pkg;
        });
        await this.removePackageScripts([
            { name: 'build', it: 'craco build' },
            { name: 'eject', it: 'craco eject' },
            { name: 'start', it: 'craco start', pre: 'npm run bootstrap' },
            { name: 'test', it: 'craco test --env=jsdom' },
            { name: 'coverage', it: 'craco test --env=jsdom --coverage --watchAll=false' },
        ]);
        await this.npmInstall();
        this.prints.scriptSucceeded(!this._flags.install);
    }
    /**
     * Upgrade from v3 to v4
     */
    async upgradeFromV3() {
        this.prints.scriptStarted('v3');
        await this.cleanupScaffold();
        await this.updatePackageJson(this.getDependencyUpdates());
        await this.removePackageScripts([
            { name: 'bootstrap', it: 'flex-plugin check-start' },
            { name: 'build', it: 'flex-plugin build', pre: 'rimraf build && npm run bootstrap' },
            { name: 'clear', it: 'flex-plugin clear' },
            { name: 'deploy', it: 'flex-plugin deploy', pre: 'npm run build' },
            { name: 'eject', it: 'flex-plugin eject' },
            { name: 'info', it: 'flex-plugin info' },
            { name: 'list', it: 'flex-plugin list' },
            { name: 'remove', it: 'flex-plugin remove' },
            { name: 'start', it: 'flex-plugin start', pre: 'npm run bootstrap' },
            { name: 'test', it: 'flex-plugin test --env=jsdom' },
        ]);
        await this.npmInstall();
        this.prints.scriptSucceeded(!this._flags.install);
    }
    /**
     * Upgrades the packages to the latest version
     */
    async upgradeToLatest() {
        this.prints.upgradeToLatest();
        await this.updatePackageJson(this.getDependencyUpdates());
        await this.npmInstall();
    }
    /**
     * Removes craco.config.js file
     */
    async cleanupScaffold() {
        await flex_plugins_utils_logger_1.progress('Cleaning up the scaffold', async () => {
            let warningLogged = false;
            if (fs_1.fileExists(this.cwd, 'craco.config.js')) {
                const sha = await fs_1.calculateSha256(this.cwd, 'craco.config.js');
                if (sha === FlexPluginsUpgradePlugin.cracoConfigSha) {
                    fs_1.removeFile(this.cwd, 'craco.config.js');
                }
                else {
                    this.prints.cannotRemoveCraco(!warningLogged);
                    warningLogged = true;
                }
            }
            const publicFiles = ['index.html', 'pluginsService.js', 'plugins.json', 'plugins.local.build.json'];
            publicFiles.forEach((file) => {
                if (fs_1.fileExists(this.cwd, 'public', file)) {
                    fs_1.removeFile(this.cwd, 'public', file);
                }
            });
            fs_1.copyFile([require.resolve('create-flex-plugin'), '..', '..', 'templates', 'core', 'public', 'appConfig.example.js'], [this.cwd, 'public', 'appConfig.example.js']);
            ['jest.config.js', 'webpack.config.js', 'webpack.dev.js'].forEach((file) => {
                fs_1.copyFile([require.resolve('create-flex-plugin'), '..', '..', 'templates', 'core', file], [this.cwd, file]);
            });
            if (fs_1.fileExists(this.cwd, 'public', 'appConfig.js')) {
                const newLines = [];
                const ignoreLines = [
                    '// set to /plugins.json for local dev',
                    '// set to /plugins.local.build.json for testing your build',
                    '// set to "" for the default live plugin loader',
                ];
                fs_1.readFile(this.cwd, 'public', 'appConfig.js')
                    .split('\n')
                    .forEach((line) => {
                    if (ignoreLines.includes(line) || line.startsWith('var pluginServiceUrl')) {
                        return;
                    }
                    newLines.push(line);
                });
                const index = newLines.findIndex((line) => line.indexOf('url: pluginServiceUrl') !== -1);
                if (index === -1) {
                    this.prints.updatePluginUrl(!warningLogged);
                }
                else {
                    newLines[index] = newLines[index].replace('url: pluginServiceUrl', "url: '/plugins'");
                }
                fs_1.writeFile(newLines.join('\n'), this.cwd, 'public', 'appConfig.js');
            }
        });
    }
    /**
     * Updates the package json by removing the provided list and updating the version to the latest from the given list.
     * Provide the list as key:value. If value is *, then script will find the latest available version.
     * @param dependencies  the list of dependencies to modify - can also be used to update to the latest
     * @param custom        a custom callback for modifying package.json
     */
    async updatePackageJson(dependencies, custom) {
        await flex_plugins_utils_logger_1.progress('Updating package dependencies', async () => {
            const { pkg } = this;
            dependencies.remove.forEach((name) => delete pkg.dependencies[name]);
            dependencies.remove.forEach((name) => delete pkg.devDependencies[name]);
            const { beta } = this._flags;
            const addDep = async (deps, record) => {
                for (const dep in deps) {
                    if (deps.hasOwnProperty(dep)) {
                        // If we have provided a specific version, use that
                        if (deps[dep] !== '*') {
                            record[dep] = deps[dep];
                            continue;
                        }
                        // Now find the latest
                        const option = FlexPluginsUpgradePlugin.pluginBuilderScripts.includes(dep) && beta ? { version: 'beta' } : {};
                        const scriptPkg = await package_json_1.default(dep, option);
                        if (!scriptPkg) {
                            this.prints.packageNotFound(dep);
                            this.exit(1);
                            return;
                        }
                        record[dep] = scriptPkg.version;
                    }
                }
            };
            await addDep(dependencies.deps, pkg.dependencies);
            await addDep(dependencies.devDeps, pkg.devDependencies);
            if (custom) {
                custom(pkg);
            }
            fs_1.writeJSONFile(pkg, this.cwd, 'package.json');
        });
    }
    /**
     * Removes scripts from the package.json
     * @param scripts the scripts remove
     */
    async removePackageScripts(scripts) {
        await flex_plugins_utils_logger_1.progress('Removing package scripts', async () => {
            const { pkg } = this;
            scripts.forEach((script) => {
                const hasScript = pkg.scripts[script.name] === script.it;
                const hasPre = pkg.scripts[`pre${script.name}`] === script.pre;
                const hasPost = pkg.scripts[`post${script.name}`] === script.post;
                if (hasScript && hasPre && hasPost) {
                    delete pkg.scripts[script.name];
                    delete pkg.scripts[`pre${script.name}`];
                    delete pkg.scripts[`post${script.name}`];
                }
                else if (pkg.scripts[script.name]) {
                    this.prints.warnNotRemoved(`Script {{${script.name}}} was not removed because it has been modified`);
                }
            });
            pkg.scripts.postinstall = 'flex-plugin pre-script-check';
            fs_1.writeJSONFile(pkg, this.cwd, 'package.json');
        });
    }
    /**
     * Runs npm install if flag is set
     */
    async npmInstall() {
        if (!this._flags.install) {
            return;
        }
        await flex_plugins_utils_logger_1.progress('Installing dependencies', async () => {
            const { exitCode, stderr } = await flex_plugins_utils_spawn_1.default('npm', [
                'install',
                '--no-fund',
                '--no-audit',
                '--no-progress',
                '--silent',
            ]);
            if (exitCode || stderr) {
                this._logger.error(stderr);
                this.exit(1);
            }
        });
    }
    /**
     * Removes the legacy plugin
     */
    async removeLegacyPlugin() {
        const { name } = this.pkg;
        await this.prints.removeLegacyNotification(name, this._flags.yes);
        // Check plugin is already registered with plugins API
        try {
            await this.pluginsClient.get(name);
        }
        catch (e) {
            if (general_1.instanceOf(e, flex_plugins_utils_exception_1.TwilioApiError) && e.status === 404) {
                this.prints.warningPluginNotInAPI(name);
                this.exit(1);
                return;
            }
            throw e;
        }
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (!serviceSid) {
            return;
        }
        const hasLegacy = await this.serverlessClient.hasLegacy(serviceSid, name);
        if (!hasLegacy) {
            this.prints.noLegacyPluginFound(name);
            this.exit(0);
            return;
        }
        await flex_plugins_utils_logger_1.progress('Deleting your legacy plugin', async () => this.serverlessClient.removeLegacy(serviceSid, name), false);
    }
    getDependencyUpdates() {
        return {
            remove: FlexPluginsUpgradePlugin.packagesToRemove,
            deps: {
                'flex-plugin-scripts': '*',
            },
            devDeps: {
                '@twilio/flex-ui': '^1',
            },
        };
    }
    /**
     * Returns the flex-plugin-scripts version from the plugin
     */
    get pkgVersion() {
        var _a;
        const pkg = this.pkg.dependencies['flex-plugin-scripts'] ||
            this.pkg.devDependencies['flex-plugin-scripts'] ||
            this.pkg.dependencies['flex-plugin'] ||
            this.pkg.devDependencies['flex-plugin'];
        if (!pkg) {
            throw new exceptions_1.TwilioCliError("Package 'flex-plugin-scripts' was not found");
        }
        return (_a = semver_1.default.coerce(pkg)) === null || _a === void 0 ? void 0 : _a.major;
    }
    /**
     * Parses the flags passed to this command
     */
    get _flags() {
        return this.parse(FlexPluginsUpgradePlugin).flags;
    }
}
exports.default = FlexPluginsUpgradePlugin;
FlexPluginsUpgradePlugin.description = general_1.createDescription(commandDocs_json_1.upgradePlugin.description, false);
FlexPluginsUpgradePlugin.flags = Object.assign(Object.assign({}, baseFlags), { 'remove-legacy-plugin': parser_1.flags.boolean({
        description: commandDocs_json_1.upgradePlugin.flags.removeLegacyPlugin,
    }), install: parser_1.flags.boolean({
        description: commandDocs_json_1.upgradePlugin.flags.install,
    }), beta: parser_1.flags.boolean({
        description: commandDocs_json_1.upgradePlugin.flags.beta,
    }), yes: parser_1.flags.boolean({
        description: commandDocs_json_1.upgradePlugin.flags.yes,
    }) });
FlexPluginsUpgradePlugin.cracoConfigSha = '4a8ecfec7b70da88a0849b7b0163808b2cc46eee08c9ab599c8aa3525ff01546';
FlexPluginsUpgradePlugin.pluginBuilderScripts = ['flex-plugin-scripts', 'flex-plugin'];
FlexPluginsUpgradePlugin.packagesToRemove = [
    'react-app-rewire-flex-plugin',
    'react-app-rewired',
    'react-scripts',
    'enzyme',
    'babel-polyfill',
    'enzyme-adapter-react-16',
    'react-emotion',
    '@craco/craco',
    'craco-config-flex-plugin',
    'core-j',
    'react-test-renderer',
    'react-scripts',
    'rimraf',
    '@types/enzyme',
    '@types/jest',
    '@types/node',
    '@types/react',
    '@types/react-dom',
    '@types/react-redux',
    'flex-plugin',
];
//# sourceMappingURL=upgrade-plugin.js.map