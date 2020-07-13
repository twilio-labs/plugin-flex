import { flags } from '@oclif/command';

import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

/**
 * Starts the dev-server for building and iterating on a flex-plugin
 */
export default class FlexPluginsStart extends FlexPlugin {
  static description = createDescription('Starts a dev-server to build the Flex plugin locally', true);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      multiple: true,
    }),
    includeremote: flags.boolean(),
  };

  /**
   * @override
   */
  async doRun() {
    const names = this._flags.name;
    const includeRemote = this._flags.includeremote;
    const flexArgs: string[] = ['flex'];

    for (let i = 0; names && i < names.length; i++) {
      flexArgs.push('--name', names[i]);
      await this.runScript('start', ['plugin', '--name', names[i]]);
    }

    if (includeRemote) {
      flexArgs.push('--include-remote');
    }

    await this.runScript('start', flexArgs);
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsStart).flags;
  }
}
