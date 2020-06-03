const buildScript = require('flex-plugin-scripts/dist/scripts/build');

const FlexPlugin = require('../../../sub-commands/flex-plugin');
const { createDescription } = require('../../../utils/general');

/**
 * Builds the flex-plugin
 */
class FlexPluginsBuild extends FlexPlugin {
  async doRun() {
    await this.runScript('build');
  }

  async runCommand() {
    return this.run();
  }
}

FlexPluginsBuild.description = createDescription(
  'Builds Flex plugin and creates a JavaScript and sourcemap bundle',
  true,
);

module.exports = FlexPluginsBuild;
