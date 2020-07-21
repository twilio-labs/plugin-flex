import { join } from 'path';

import { flags } from '@oclif/command';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { filesExist } from '../../../utils/fs';

/**
 * Starts the dev-server for building and iterating on a flex-plugin
 */
export default class FlexPluginsStart extends FlexPlugin {
  static description = createDescription('Starts a dev-server to build the Flex plugin locally', false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      multiple: true,
      char: 'n',
    }),
    'include-remote': flags.boolean(),
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
    const names = this._flags.name;
    const includeRemote = this._flags['include-remote'];
    const flexArgs: string[] = [];
    const pluginArgs: string[][] = [];

    if (names) {
      for (const name of names) {
        flexArgs.push('--name', name);
        pluginArgs.push(['--name', name]);
      }
    }

    if (includeRemote) {
      flexArgs.push('--include-remote');
    }

    // If running in a plugin directory, append it to the names
    if (filesExist(join(this.cwd, 'public', 'appConfig.js')) && !flexArgs.includes(this.pkg.name)) {
      flexArgs.push('--name', this.pkg.name);
      pluginArgs.push(['--name', this.pkg.name]);
    }

    if (flexArgs.length && pluginArgs.length) {
      await this.runScript('start', ['flex', ...flexArgs]);
      for (let i = 0; pluginArgs && i < pluginArgs.length; i++) {
        await this.runScript('start', ['plugin', ...pluginArgs[i]]);
      }
    } else if (includeRemote && !pluginArgs.length) {
      await this.runScript('start', ['--include-remote']);
    } else {
      throw new Error('Incorrect format. Please follow the cli format guidelines.');
    }
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsStart).flags;
  }
}
