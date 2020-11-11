import { expect } from 'chai';
import { ServiceListInstance } from 'twilio/lib/rest/serverless/v1/service';

import { sinon } from '../framework';
import ServerlessClient from '../../clients/ServerlessClient';

describe('ServerlessClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const buildSid = 'ZB00000000000000000000000000000000';
  const pluginName = 'plugin-name';

  const fetchService = sinon.stub();
  const listEnv = sinon.stub();
  const getBuild = sinon.stub();
  const getService = sinon.stub();
  const createService = sinon.stub();
  getService.returns({
    fetch: fetchService,
    environments: {
      list: listEnv,
    },
    builds: {
      get: () => ({
        fetch: getBuild,
      }),
    },
  });

  // @ts-ignore
  const twilioClient = { get: getService, create: createService } as ServiceListInstance;
  const client = new ServerlessClient(twilioClient);

  beforeEach(() => {
    sinon.restore();
  });

  describe('getLegacyAsset', () => {
    it('should return false ', async () => {
      const build = {
        assetVersions: [
          {
            path: '/some/path',
          },
          {
            path: 'another-path',
          },
        ],
      };

      // @ts-ignore
      expect(client.getLegacyAsset(build, pluginName)).to.equal(undefined);
    });

    it('should return true', async () => {
      const build = {
        assetVersions: [
          {
            path: `/plugins/${pluginName}/0.0.0/bundle.js`,
          },
          {
            path: 'another-path',
          },
        ],
      };
      // @ts-ignore
      expect(client.getLegacyAsset(build, pluginName)).to.equal(build.assetVersions[0]);
    });
  });

  describe('getBuildAndEnvironment', () => {
    const service = { sid: serviceSid };
    const environment = { uniqueName: pluginName, buildSid: null };

    // @ts-ignore
    const getBuildAndEnvironment = async () => client.getBuildAndEnvironment(serviceSid, pluginName);

    beforeEach(() => {
      fetchService.resetHistory();
      getService.resetHistory();
      listEnv.resetHistory();
      getBuild.resetHistory();
    });

    it('should return empty object if no service is found', async () => {
      fetchService.returns(Promise.resolve(null));
      const result = await getBuildAndEnvironment();

      expect(result).to.eql({});
      expect(fetchService).to.have.been.called;
      expect(getService).to.have.been.called;
      expect(getService).to.have.been.calledWith(serviceSid);
      expect(listEnv).not.to.have.been.called;
      expect(getBuild).not.to.have.been.called;
    });

    it('should return empty object if no environment is found', async () => {
      fetchService.returns(Promise.resolve(service));
      listEnv.returns(Promise.resolve([]));
      const result = await getBuildAndEnvironment();

      expect(result).to.eql({});
      expect(fetchService).to.have.been.called;
      expect(getService).to.have.been.called;
      expect(getService).to.have.been.calledWith(serviceSid);
      expect(listEnv).to.have.been.calledOnce;
      expect(getBuild).not.to.have.been.called;
    });

    it('should return empty object if environment has no buildSid', async () => {
      fetchService.returns(Promise.resolve(service));
      listEnv.returns(Promise.resolve([environment]));
      const result = await getBuildAndEnvironment();

      expect(result).to.eql({});
      expect(fetchService).to.have.been.called;
      expect(getService).to.have.been.called;
      expect(getService).to.have.been.calledWith(serviceSid);
      expect(listEnv).to.have.been.calledOnce;
      expect(getBuild).not.to.have.been.called;
    });

    it('should return build and environment', async () => {
      const env = { ...environment, buildSid };
      const build = { sid: buildSid };
      fetchService.returns(Promise.resolve(service));
      listEnv.returns(Promise.resolve([env]));
      getBuild.returns(Promise.resolve(build));
      const result = await getBuildAndEnvironment();

      expect(result).to.eql({ environment: env, build });
      expect(fetchService).to.have.been.called;
      expect(getService).to.have.been.called;
      expect(getService).to.have.been.calledWith(serviceSid);
      expect(listEnv).to.have.been.calledOnce;
      expect(getBuild).to.have.been.called;
    });
  });

  describe('hasLegacy', () => {
    after(() => {
      // @ts-ignore
      client.getBuildAndEnvironment.restore();
    });

    it('should return false if no build is found', async () => {
      // @ts-ignore
      sinon.stub(client, 'getBuildAndEnvironment').returns(Promise.resolve({}));

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).to.equal(false);
      // @ts-ignore
      const { getBuildAndEnvironment } = client;
      expect(getBuildAndEnvironment).to.have.been.calledOnce;
      expect(getBuildAndEnvironment).to.have.been.calledWith(serviceSid, pluginName);
    });

    it('should return false if no bundle is found', async () => {
      const build = {
        assetVersions: [
          {
            path: '/some/path',
          },
          {
            path: 'another-path',
          },
        ],
      };
      // @ts-ignore
      sinon.stub(client, 'getBuildAndEnvironment').returns(Promise.resolve({ build }));

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).to.equal(false);
    });

    it('should return true', async () => {
      const build = {
        assetVersions: [
          {
            path: `/plugins/${pluginName}/0.0.0/bundle.js`,
          },
          {
            path: 'another-path',
          },
        ],
      };
      // @ts-ignore
      sinon.stub(client, 'getBuildAndEnvironment').returns(Promise.resolve({ build }));

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).to.equal(true);
    });
  });

  describe('getOrCreateDefaultService', () => {
    beforeEach(() => {
      createService.reset();
    });

    it('should return existing service', async () => {
      const service1 = { uniqueName: 'default' };
      const service2 = { uniqueName: 'anotherName' };

      // @ts-ignore
      sinon.stub(client, 'listServices').returns(Promise.resolve([service1, service2]));

      const service = await client.getOrCreateDefaultService();

      expect(service).to.eql(service1);
      expect(client.listServices).to.have.been.calledOnce;
      expect(createService).not.to.have.been.called;
    });

    it('should not find service and instead create a new service', async () => {
      const service1 = { uniqueName: 'notDefault' };
      const service2 = { uniqueName: 'anotherName' };
      const newService = { uniqueName: 'default' };

      // @ts-ignore
      sinon.stub(client, 'listServices').returns(Promise.resolve([service1, service2]));
      createService.returns(Promise.resolve(newService));

      const service = await client.getOrCreateDefaultService();

      expect(service).to.eql(newService);
      expect(client.listServices).to.have.been.calledOnce;
      expect(createService).to.have.been.calledOnce;
      expect(createService).to.have.been.calledWith(ServerlessClient.NewService);
    });

    it('should create a new service because no services have been found', async () => {
      const newService = { uniqueName: 'default' };

      // @ts-ignore
      sinon.stub(client, 'listServices').returns(Promise.resolve([]));
      createService.returns(Promise.resolve(newService));

      const service = await client.getOrCreateDefaultService();

      expect(service).to.eql(newService);
      expect(client.listServices).to.have.been.calledOnce;
      expect(createService).to.have.been.calledOnce;
      expect(createService).to.have.been.calledWith(ServerlessClient.NewService);
    });
  });
});
