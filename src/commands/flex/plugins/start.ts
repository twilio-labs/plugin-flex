import { flags } from '@oclif/command';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';

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
    const flexInput: string[] = [];
    const pluginInput: string[][] = [];

    for (let i = 0; names && i < names.length; i++) {
      flexInput.push('--name', names[i]);
      pluginInput.push(['--name', names[i]]);
    }

    if (includeRemote) {
      flexInput.push('--include-remote');
    }

    if (flexInput) {
      await this.runScript('start', ['flex', ...flexInput]);
    }

    for (let i = 0; pluginInput && i < pluginInput.length; i++) {
      await this.runScript('start', ['plugin', ...pluginInput[i]]);
    }

    if (!flexInput && !pluginInput) {
      await this.runScript('start');
    }
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsStart).flags;
  }
}
