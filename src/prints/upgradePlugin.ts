import { Logger, singleLineString } from 'flex-plugins-utils-logger';

const cracoUpgradeGuideLink = 'https://twilio.com';

/**
 * Script started
 */
const scriptStarted = (logger: Logger) => () => {
  logger.info('@@Upgrading your plugin from v3 to the v4@@');
  logger.newline();
};

/**
 * Script succeeded
 */
const scriptSucceeded = (logger: Logger) => (needsInstall: boolean) => {
  logger.newline();
  logger.success('🎉 Your plugin was successfully migrated to use the latest (v4) version of Flex Plugins CLI.');
  logger.newline();

  logger.info('**Next Steps:**');
  const helpInstruction = '{{$ twilio flex:plugins --help}} to find out more about the new CLI.';
  if (needsInstall) {
    logger.info(`Run {{$ npm install}} to update all the dependencies and then ${helpInstruction}`);
  } else {
    logger.info(`Run ${helpInstruction}`);
  }
};

/**
 * Failed to update plugin's url
 */
const updatePluginUrl = (logger: Logger) => (newline: boolean) => {
  if (newline) {
    logger.newline();
  }
  logger.info(
    singleLineString(
      '> !!Could not update {{public/appConfig.js}} because your pluginService url has been modified.',
      "Please update the pluginService url to '/plugins'.",
      'You may take a look at {{public/appConfig.example.js}} for guidance.!!',
    ),
  );
};

/**
 * Cannot remove craco because it has been modified
 */
const cannotRemoveCraco = (logger: Logger) => (newline: boolean) => {
  if (newline) {
    logger.newline();
  }

  logger.info(
    singleLineString(
      '> !!Cannot remove {{craco.config.js}} because it has been modified from its default value.',
      `Please review @@${cracoUpgradeGuideLink}@@ for more information.!!`,
    ),
  );
};

/**
 * Required package not found
 */
const packageNotFound = (logger: Logger) => (pkg: string) => {
  logger.newline(2);
  logger.error(`Could not find package **${pkg}** from npm repository; check your internet connection and try again.`);
};

/**
 * Warns about upgrade from the provided version is not available
 */
const notAvailable = (logger: Logger) => (version?: number) => {
  logger.error(`No migration is available for your current version v${version}.`);
};

/**
 * Warns that we could not remove a particular file or delete a script. Requires manual change
 */
const warnNotRemoved = (logger: Logger) => (note: string) => {
  logger.newline();
  logger.info(`> !!${note}. Please review and remove it manually.!!`);
};

export default (logger: Logger) => ({
  scriptStarted: scriptStarted(logger),
  scriptSucceeded: scriptSucceeded(logger),
  updatePluginUrl: updatePluginUrl(logger),
  cannotRemoveCraco: cannotRemoveCraco(logger),
  packageNotFound: packageNotFound(logger),
  notAvailable: notAvailable(logger),
  warnNotRemoved: warnNotRemoved(logger),
});
