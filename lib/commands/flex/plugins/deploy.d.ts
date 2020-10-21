import { PluginVersionResource } from 'flex-plugins-api-client/dist/clients/pluginVersions';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';
import * as flags from '../../../utils/flags';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
/**
 * Parses the version input
 * @param input
 */
export declare const parseVersionInput: (input: string) => string;
/**
 * Builds and then deploys the Flex Plugin
 */
export default class FlexPluginsDeploy extends FlexPlugin {
    static description: string;
    static flags: {
        patch: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        minor: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        major: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        version: flags.SizeIOptionFlag<string | undefined>;
        public: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        changelog: flags.SizeIOptionFlag<string>;
        description: flags.SizeIOptionFlag<string | undefined>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    private prints;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<void>;
    /**
     * Validates that the provided next plugin version is valid
     * @returns {Promise<void>}
     */
    validatePlugin(): Promise<{
        currentVersion: string;
        nextVersion: string;
    }>;
    /**
     * Registers a plugin with Plugins API
     * @returns {Promise}
     */
    registerPlugin(): Promise<import("flex-plugins-api-client").PluginResource>;
    /**
     * Registers a Plugin Version
     * @param deployResult
     * @returns {Promise}
     */
    registerPluginVersion(deployResult: DeployResult): Promise<PluginVersionResource>;
    /**
     * Checks to see if a legacy plugin exist
     */
    checkForLegacy(): Promise<void>;
    /**
     * Finds the version bump level
     * @returns {string}
     */
    get bumpLevel(): "minor" | "major" | "patch";
    get _flags(): {
        patch: boolean;
        minor: boolean;
        major: boolean;
        version: string | undefined;
        public: boolean;
        changelog: string;
        description: string | undefined;
        json: boolean;
        'clear-terminal': boolean;
        region: string;
    };
}
