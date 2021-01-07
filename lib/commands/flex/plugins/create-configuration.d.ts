import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';
/**
 * Creates a Flex Plugin Configuration
 */
export default class FlexPluginsCreateConfiguration extends CreateConfiguration {
    static description: string;
    static flags: {
        new: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        name: import("../../../utils/flags").SizeIOptionFlag<string>;
        plugin: import("@oclif/parser/lib/flags").IOptionFlag<string[]>;
        description: import("../../../utils/flags").SizeIOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<void>;
}
