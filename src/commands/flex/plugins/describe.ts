import { flags } from '@oclif/command';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsDescribe extends FlexPlugin {
  static description = createDescription('Describes a plugin', false);

  static args = [
    {
      name: 'resource',
      required: false,
      description: 'The resource to describe',
    },
  ];

  static flags = {
    name: flags.string({
      multiple: true,
      required: true,
      description: 'The plugin name to describe',
    }),
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
  }

  async doRun() {
    console.log(this.resource);
    console.log(this.parse(FlexPluginsDescribe));
  }

  get _flags() {
    return this.parse(FlexPluginsDescribe).flags;
  }

  get resource() {
    return this.parse(FlexPluginsDescribe).args.resource;
  }
}
