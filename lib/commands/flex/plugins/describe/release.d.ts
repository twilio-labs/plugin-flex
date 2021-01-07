import { flags } from '@oclif/command';
import { DescribeRelease } from 'flex-plugins-api-toolkit';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Describes the Flex Plugin Release
 */
export default class FlexPluginsDescribeRelease extends InformationFlexPlugin<DescribeRelease> {
    static description: string;
    static flags: {
        sid: flags.IOptionFlag<string | undefined>;
        active: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    /**
     * @override
     */
    getResource(): Promise<DescribeRelease>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(release: DescribeRelease): void;
    /**
     * Parses the flags passed to this command
     */
    get _flags(): {
        sid: string | undefined;
        active: boolean;
        json: boolean;
        'clear-terminal': boolean;
        region: string;
    };
}
