"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
/**
 * Wrapper Twilio Serverless Public API
 */
class ServerlessClient {
    constructor(client) {
        this.client = client;
    }
    /**
     * Determines if the given plugin has a legacy (v0.0.0) bundle
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    async hasLegacy(serviceSid, pluginName) {
        const { build } = await this.getBuildAndEnvironment(serviceSid, pluginName);
        if (!build) {
            return false;
        }
        return Boolean(this.getLegacyAsset(build, pluginName));
    }
    /**
     * Removes the legacy bundle (v0.0.0)
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    async removeLegacy(serviceSid, pluginName) {
        const { build, environment } = await this.getBuildAndEnvironment(serviceSid, pluginName);
        if (!build || !environment) {
            return;
        }
        if (!this.getLegacyAsset(build, pluginName)) {
            return;
        }
        const assets = build.assetVersions
            .map((asset) => asset)
            .filter((asset) => !asset.path.includes(`/plugins/${pluginName}/0.0.0/bundle.js`))
            .map((asset) => asset.sid);
        const functions = build.functionVersions.map((func) => func).map((func) => func.sid);
        const data = {
            assetVersions: assets,
            functionVersions: functions,
            // @ts-ignore this is a type definition error in Twilio; dependencies should be object[] not a string
            dependencies: build.dependencies,
        };
        const newBuild = await this.createBuild(serviceSid, data);
        await environment.deployments().create({ buildSid: newBuild.sid });
    }
    /**
     * Fetches the {@link BuildInstance}
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    async getBuildAndEnvironment(serviceSid, pluginName) {
        const list = await this.client.get(serviceSid).environments.list();
        const environment = list.find((e) => e.uniqueName === pluginName);
        if (!environment) {
            return {};
        }
        const build = await this.client.get(serviceSid).builds.get(environment.buildSid).fetch();
        return {
            build,
            environment,
        };
    }
    /**
     * Creates a new {@link BuildInstance}
     * @param serviceSid  the service sid
     * @param data the {@link BuildListInstanceCreateOptions}
     */
    async createBuild(serviceSid, data) {
        return new Promise(async (resolve, reject) => {
            const newBuild = await this.client.get(serviceSid).builds.create(data);
            const { sid } = newBuild;
            const timeoutId = setTimeout(() => {
                // eslint-disable-next-line no-use-before-define
                clearInterval(intervalId);
                reject(new flex_plugins_utils_exception_1.TwilioApiError(11205, 'Timeout while waiting for new Twilio Runtime build status to change to complete.', 408));
            }, ServerlessClient.timeoutMsec);
            const intervalId = setInterval(async () => {
                const build = await this.client.get(serviceSid).builds.get(sid).fetch();
                if (build.status === 'failed') {
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    reject(new flex_plugins_utils_exception_1.TwilioApiError(20400, 'Twilio Runtime build has failed.', 400));
                }
                if (build.status === 'completed') {
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    resolve(build);
                }
            }, ServerlessClient.pollingIntervalMsec);
        });
    }
    /**
     * Internal method to determine if the build has a legacy bundle
     * @param build   the {@link BuildInstance}
     * @param pluginName the plugin name
     * @private
     */
    getLegacyAsset(build, pluginName) {
        return build.assetVersions
            .map((asset) => asset)
            .find((asset) => asset.path === `/plugins/${pluginName}/0.0.0/bundle.js`);
    }
}
exports.default = ServerlessClient;
ServerlessClient.timeoutMsec = 30000;
ServerlessClient.pollingIntervalMsec = 500;
//# sourceMappingURL=ServerlessClient.js.map