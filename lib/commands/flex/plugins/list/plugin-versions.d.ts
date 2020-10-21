import { ListPluginVersions } from 'flex-plugins-api-toolkit/dist/scripts';
import { flags } from '@oclif/command';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Lists the Flex Plugin Versions
 */
export default class FlexPluginsListPluginVersions extends InformationFlexPlugin<ListPluginVersions[]> {
    static description: string;
    static flags: {
        name: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    /**
     * @override
     */
    getResource(): Promise<ListPluginVersions[]>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(versions: ListPluginVersions[]): void;
    /**
     * Parses the flags passed to this command
     */
    get _flags(): {
        name: string;
        json: boolean;
        'clear-terminal': boolean;
        region: string;
    };
}