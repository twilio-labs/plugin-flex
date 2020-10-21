import { Logger } from 'flex-plugins-utils-logger';
declare const _default: (logger: Logger) => {
    upgradePlugin: {
        upgradeNotification: (skip: boolean) => Promise<void>;
        scriptStarted: (version: string) => void;
        upgradeToLatest: () => void;
        scriptSucceeded: (needsInstall: boolean) => void;
        updatePluginUrl: (newline: boolean) => void;
        cannotRemoveCraco: (newline: boolean) => void;
        packageNotFound: (pkg: string) => void;
        notAvailable: (version?: number | undefined) => void;
        warnNotRemoved: (note: string) => void;
        removeLegacyNotification: (pluginName: string, skip: boolean) => Promise<void>;
        noLegacyPluginFound: (pluginName: string) => void;
        removeLegacyPluginSucceeded: (pluginName: string) => void;
        warningPluginNotInAPI: (pluginName: string) => void;
    };
    deploy: {
        deploySuccessful: (name: string, availability: string, deployedData: import("flex-plugin-scripts/dist/scripts/deploy").DeployResult) => void;
        warnHasLegacy: () => void;
    };
    release: {
        releaseSuccessful: (configurationSid: string) => void;
    };
};
export default _default;
