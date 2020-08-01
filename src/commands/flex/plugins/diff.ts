import { ConfigurationsDiff, DiffOperation } from 'flex-plugins-api-toolkit/dist/tools/diff';
import { ConfiguredPlugins } from 'flex-plugins-api-toolkit/dist/scripts/describeConfiguration';
import { logger } from 'flex-plugins-utils-logger';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { TwilioCliError } from '../../../exceptions';

/**
 * Builds and then deploys the Flex plugin
 */
export default class FlexPluginsDiff extends FlexPlugin {
  static description = createDescription('Finds the diff between two configurations', false);

  static parser = (input: string) => {
    if (!input || !input.startsWith('FJ')) {
      throw new TwilioCliError(`Identifier must of a ConfigurationSid instead got ${input}`);
    }

    return input;
  };

  static args = [
    {
      name: 'oldId',
      required: true,
      parse: FlexPluginsDiff.parser,
    },
    {
      name: 'newId',
      required: true,
      arse: FlexPluginsDiff.parser,
    },
  ];

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });
  }

  printPluginDiff = (diff: ConfigurationsDiff) => {
    const plugin = diff.value as ConfiguredPlugins;
    this.printVersion(`${plugin.name}@${plugin.version}`);
    this.printPretty(plugin, 'version', 'name');
    this._logger.info(logger.colors.bgRed.black('this is a red line'));
    this._logger.info(logger.colors.bgGreen.black('this is a red line'));
    this._logger.info(logger.colors.strikethrough('this is a strike thourgh line'));
    this._logger.info('++green line++');
    this._logger.info('--red line--');
    this._logger.newline();
  };

  /**
   * @override
   */
  async doRun() {
    const diffs = await this.pluginsApiToolkit.diff({
      resource: 'configuration',
      oldIdentifier: this._args.oldId,
      newIdentifier: this._args.newId,
    });
    const plugins = diffs.filter((diff) => diff.path === 'plugins');
    const added = plugins.filter((diff) => diff.operation === DiffOperation.Added);
    const removed = plugins.filter((diff) => diff.operation === DiffOperation.Removed);

    this.printHeader('Added');
    added.forEach(this.printPluginDiff);

    this.printHeader('Removed');
    removed.forEach(this.printPluginDiff);
  }

  /* istanbul ignore next */
  get _flags() {
    return this.parse(FlexPluginsDiff).flags;
  }

  /* istanbul ignore next */
  get _args() {
    return this.parse(FlexPluginsDiff).args;
  }
}
