import { IOptionFlag } from '@oclif/command/lib/flags';
import * as flags from '../utils/flags';
import FlexPlugin, { FlexPluginFlags } from './flex-plugin';
declare type Required = {
    required: true;
};
declare type Multiple = {
    multiple: true;
};
export interface CreateConfigurationFlags extends FlexPluginFlags {
    new: boolean;
    name?: string;
    plugin?: string[];
    description?: string;
}
export declare const nameFlag: {
    description: string;
    default: string;
    required: boolean;
    max: number;
};
export declare const pluginFlag: Partial<IOptionFlag<string[]>> & Required & Multiple;
export declare const descriptionFlag: {
    description: string;
    default: string;
    required: boolean;
    max: number;
};
/**
 * Creates a Configuration
 */
export default abstract class CreateConfiguration extends FlexPlugin {
    static flags: {
        new: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        name: flags.SizeIOptionFlag<string>;
        plugin: import("@oclif/parser/lib/flags").IOptionFlag<string[]>;
        description: flags.SizeIOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: IOptionFlag<string>;
    };
    /**
     * Performs the actual task of validating and creating configuration. This method is also usd by release script.
     */
    protected doCreateConfiguration(): Promise<import("flex-plugins-api-toolkit").CreateConfiguration>;
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    private createConfiguration;
    get _flags(): CreateConfigurationFlags;
}
export {};
