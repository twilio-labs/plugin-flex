import { Logger, singleLineString } from 'flex-plugins-utils-logger';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';

import CreateConfiguration from '../sub-commands/create-configuration';

/**
 * Prints the successful message of a plugin deployment
 */
export const deploySuccessful = (logger: Logger) => (
  name: string,
  availability: string,
  deployedData: DeployResult,
) => {
  logger.newline();
  logger.success(
    `🚀 Plugin (${availability}) **${name}**@**${deployedData.nextVersion}** was successfully deployed using Plugins API`,
  );
  logger.newline();

  // update this description
  logger.info('**Next Steps:**');
  logger.info(
    singleLineString(
      'Run {{$ twilio flex:plugins:release',
      `\\-\\-plugin ${name}@${deployedData.nextVersion}`,
      `\\-\\-name "${CreateConfiguration.flags.name.default}"`,
      `\\-\\-description "${CreateConfiguration.flags.description.default}}}`,
      'to enable this plugin on your flex instance',
    ),
  );
  logger.newline();
};

export default (logger: Logger) => ({
  deploySuccessful: deploySuccessful(logger),
});
