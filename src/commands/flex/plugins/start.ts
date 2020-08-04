import { flags } from '@oclif/command';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';

/**
 * Starts the dev-server for building and iterating on a flex-plugin
 */
export default class FlexPluginsStart extends FlexPlugin {
  static description = createDescription(
    'Starts a dev-server to build the Flex plugin locally. If the --name flag is used at least once, the command does not need to be invoked in a plugin directory. Else, it does.',
    false,
  );

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      multiple: true,
      description:
        'The name of the plugin(s) you would like to run, formatted as pluginName to run locally, or pluginName@remote to run remotely.',
    }),
    'include-remote': flags.boolean({
      description: 'Use this flag to include all remote plugins in your build.',
    }),
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, {});

    if (this._flags['include-remote'] || this._flags.name) {
      this.opts.runInDirectory = false;
    }
  }

  /**
   * @override
   */
  async doRun() {
    const flexArgs: string[] = [];
    const pluginNames: string[] = [];

    if (this._flags.name) {
      for (const name of this._flags.name) {
        flexArgs.push('--name', name);
        if (!name.includes('@remote')) {
          pluginNames.push(name);
        }
      }
    }

    if (this._flags['include-remote']) {
      flexArgs.push('--include-remote');
    }

    // If running in a plugin directory, append it to the names
    if (this.isPluginFolder() && !flexArgs.includes(this.pkg.name)) {
      flexArgs.push('--name', this.pkg.name);
      pluginNames.push(this.pkg.name);
    }

    if (flexArgs.length && pluginNames.length) {
      await this.runScript('start', ['flex', ...flexArgs]);
      for (let i = 0; pluginNames && i < pluginNames.length; i++) {
        await this.runScript('check-start', ['--name', pluginNames[i]]);
        await this.runScript('start', ['plugin', '--name', pluginNames[i]]);
      }
    }
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsStart).flags;
  }
}
