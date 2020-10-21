import { flags } from '@oclif/command';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';
/**
 * Creates a Flex Plugin Configuration and releases and sets it to active
 */
export default class FlexPluginsRelease extends CreateConfiguration {
    static description: string;
    static flags: {
        'configuration-sid': flags.IOptionFlag<string | undefined>;
        name: flags.IOptionFlag<string>;
        plugin: flags.IOptionFlag<string[]>;
        description: flags.IOptionFlag<string>;
        new: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    private prints;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<void>;
    doCreateRelease(configurationSid: string): Promise<void>;
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    createRelease(configurationSid: string): Promise<import("flex-plugins-api-toolkit").Release>;
    get _flags(): {
        'configuration-sid': string | undefined;
        name: string;
        plugin: string[];
        description: string;
        new: boolean;
        json: boolean;
        'clear-terminal': boolean;
        region: string;
    };
}