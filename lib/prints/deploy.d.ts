import { Logger } from 'flex-plugins-utils-logger';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';
/**
 * Prints the successful message of a plugin deployment
 */
export declare const deploySuccessful: (logger: Logger) => (name: string, availability: string, deployedData: DeployResult) => void;
/**
 * Warns about having legacy plugins
 */
export declare const warnHasLegacy: (logger: Logger) => () => void;
declare const _default: (logger: Logger) => {
    deploySuccessful: (name: string, availability: string, deployedData: DeployResult) => void;
    warnHasLegacy: () => void;
};
export default _default;
