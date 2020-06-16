const { expect, createTest } = require('../helper');
const fs = require('../../src/utils/fs');
const FlexPlugin = require('../../src/sub-commands/flex-plugin');

describe('SubCommands/FlexPlugin', () => {
  const { env } = process;
  const { sinon, start } = createTest(FlexPlugin);

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    sinon.restore();
  });

  start()
    .setup(async () => {
      sinon.stub(fs, 'filesExist').returns(true);
    })
    .test((cmd) => {
      const result = cmd.isPluginFolder();

      expect(result).to.equal(true);
      expect(fs.filesExist).to.have.been.calledOnce;
      expect(fs.filesExist).to.have.been.calledWith(`${process.cwd()}/public/appConfig.js`);
    })
    .it('should test isPluginFolder to be true');

  start()
    .setup(async () => {
      sinon.stub(fs, 'filesExist').returns(false);
    })
    .test((cmd) => {
      const result = cmd.isPluginFolder();

      expect(result).to.equal(false);
      expect(fs.filesExist).to.have.been.calledOnce;
      expect(fs.filesExist).to.have.been.calledWith(`${process.cwd()}/public/appConfig.js`);
    })
    .it('should test isPluginFolder to be false');

  start()
    .test(async (cmd, _, done) => {
      try {
        await cmd.doRun();
      } catch (e) {
        expect(e.message).to.contain(' must be implemented');
        done();
      }
    })
    .it('should tet doRun throws exception');

  start()
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'doRun').resolves();

      await cmd.run();
    })
    .test(() => {
      expect(process.env.SKIP_CREDENTIALS_SAVING).to.equal('true');
      expect(process.env.TWILIO_ACCOUNT_SID).to.not.be.empty;
      expect(process.env.TWILIO_AUTH_TOKEN).to.not.be.empty;
    })
    .it('should call setEnvironment');

  start()
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'setupEnvironment');
      sinon.stub(cmd, 'doRun').resolves();

      await cmd.run();
    })
    .test((cmd) => {
      expect(cmd.pluginsApiToolkit).to.be.exist;
      expect(cmd.pluginsClient).to.be.exist;
      expect(cmd.pluginVersionsClient).to.be.exist;
      expect(cmd.configurationsClient).to.be.exist;

      expect(cmd.isPluginFolder).to.have.been.calledOnce;
      expect(cmd.setupEnvironment).to.have.been.calledOnce;
      expect(cmd.doRun).to.have.been.calledOnce;
    })
    .it('should run the main command successfully');
});