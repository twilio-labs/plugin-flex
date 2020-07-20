import { flags } from '@oclif/command';
import { DescribePlugin } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsDescribePlugin extends InformationFlexPlugin<DescribePlugin> {
  static description = createDescription('Describes a plugin', false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      required: true,
      description: 'The plugin name to describe',
    }),
  };

  /**
   * @override
   */
  async getResource() {
    return this.pluginsApiToolkit.describePlugin({ name: this._flags.name });
  }

  /**
   * @override
   */
  notFound() {
    this._logger.info(`!!Plugin **${this._flags.name}** was not found.!!`);
  }

  /**
   * @override
   */
  print(plugin: DescribePlugin) {
    this.printHeader('SID', plugin.sid);
    this.printHeader('Name', plugin.name);
    this.printHeader('Status', plugin.isActive ? 'Active' : 'Inactive');
    this.printHeader('Friendly Name', plugin.friendlyName);
    this.printHeader('Description', plugin.description);
    this.printHeader('Created', this.parseDate(plugin.dateCreated));
    this.printHeader('Updated', this.parseDate(plugin.dateUpdated));
    this._logger.newline();

    this.printHeader('Versions');
    this.sortByActive(plugin.versions).forEach((version) => {
      const isActive = version.isActive ? '(Active)' : '';
      this.printVersion(version.version, isActive);
      this.printPretty(version, 'isActive');
      this._logger.newline();
    });
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsDescribePlugin).flags;
  }
}