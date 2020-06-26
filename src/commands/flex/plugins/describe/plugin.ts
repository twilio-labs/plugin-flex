import { flags } from '@oclif/command';
import { TwilioApiError } from 'flex-plugins-utils-exception';
import { PluginVersion } from 'flex-plugins-api-toolkit/dist/scripts/describePluginVersion';
import { DescribePlugin } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../../sub-commands/flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsDescribePlugin extends FlexPlugin {
  static description = createDescription('Describes a plugin', false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      required: true,
      description: 'The plugin name to describe',
    }),
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
  }

  async doRun() {
    try {
      const { name } = this._flags;
      const plugin = await this.pluginsApiToolkit.describePlugin({ name });
      if (this.isJson) {
        return plugin;
      }

      const version = plugin.versions[0].version || 'N/A';
      const versionCount = plugin.versions.length || 0;

      const firstRow = [`**++${plugin.name}++@++${version}++**`, `versions: !!${versionCount}!!`];
      if (plugin.isActive) {
        firstRow.push('**Active**');
      }
      this._logger.info(firstRow.join(' | '));

      if (plugin.description) {
        this._logger.info(plugin.description);
      }
      this._logger.newline();
      this._logger.info('Versions:');
      if (versionCount) {
        plugin.versions.forEach((resource: PluginVersion) => {
          const acl = resource.isPrivate ? 'privately' : 'publicly';
          const releasedInfo = `(published **${acl}** on !!${this.parseDate(resource.dateCreated)}!!)`;
          if (resource.isActive) {
            this._logger.info(`- **++${resource.version}++** ${releasedInfo} | **Active**`);
          } else {
            this._logger.info(`- ++${resource.version}++ ${releasedInfo}`);
          }

          if (resource.changelog) {
            this._logger.info(`${resource.changelog}`);
          }
          this._logger.info(`[[${resource.url}]]`);
          this._logger.newline();
        });
      } else {
        this._logger.info('No versions have been uploaded yet.');
      }
    } catch (e) {
      if (e.instanceOf && e.instanceOf(TwilioApiError)) {
        this._logger.info(`!!Plugin **${name}** was not found.!!`);
        this.exit(1);
        return null;
      }

      throw e;
    }

    return null;
  }

  get _flags() {
    return this.parse(FlexPluginsDescribePlugin).flags;
  }
}
