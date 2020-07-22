import { expect, createTest } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';

describe('Commands/FlexPluginsStart', () => {
  const { sinon, start } = createTest(FlexPluginsStart);

  afterEach(() => {
    sinon.restore();
  });

  start(['start', '--name', 'plugin-testOne', '--name', 'plugin-testTwo', '--include-remote'])
    .setup(async (instance) => {
      sinon.stub(instance, 'doRun').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(true);
      await instance.run();
    })
    .test(async (instance) => {
      expect(instance._flags.name.includes('plugin-testOne'));
      expect(instance._flags.name.includes('plugin-testTwo'));
      expect(instance._flags['include-remote'].valueOf()).to.be.true;
    })
    .it('should read the name and include-remote flags');
});
