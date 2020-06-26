import { createDescription } from '../../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../../sub-commands/flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsListPlugins extends FlexPlugin {
  static description = createDescription('Lists plugins the account has', false);

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
  }

  async doRun() {
    const plugin = await this.pluginsApiToolkit.listPlugins({});
    console.log(plugin);
  }
}
