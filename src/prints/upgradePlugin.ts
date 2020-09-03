import { Logger } from 'flex-plugins-utils-logger';

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
const scriptSucceeded = (logger: Logger) => () => {
  logger.newline();
  logger.success('Migration was successful!');
};

/**
 * Cannot remove craco because it has been modified
 */
const cannotRemoveCraco = (logger: Logger) => () => {};

/**
 * Warns about upgrade from the provided version is not available
 */
const notAvailable = (logger: Logger) => (version?: number) => {
  // to be filled
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
  cannotRemoveCraco: cannotRemoveCraco(logger),
  notAvailable: notAvailable(logger),
  warnNotRemoved: warnNotRemoved(logger),
});
