import { join } from 'path';

import { Logger } from 'flex-plugins-utils-logger';
import PluginsApiToolkit from 'flex-plugins-api-toolkit';
import { baseCommands, services } from '@twilio/cli-core';
import {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
} from 'flex-plugins-api-client';
import { TwilioError } from 'flex-plugins-utils-exception';

import { filesExist, readJSONFile } from '../utils/fs';
import { TwilioCliError } from '../exceptions';

interface FlexPluginOption {
  strict: boolean;
}

export type ConfigData = typeof services.config.ConfigData;
export type SecureStorage = typeof services.secureStorage.SecureStorage;

/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
export default class FlexPlugin extends baseCommands.TwilioClientCommand {
  protected readonly opts: FlexPluginOption;

  protected readonly cwd: string;

  protected readonly skipEnvironmentalSetup: boolean;

  protected readonly _logger: Logger;

  protected scriptArgs: string[];

  private _pluginsApiToolkit?: PluginsApiToolkit;

  private _pluginsClient?: PluginsClient;

  private _pluginVersionsClient?: PluginVersionsClient;

  private _configurationsClient?: ConfigurationsClient;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage, opts: FlexPluginOption) {
    super(argv, config, secureStorage);

    this.opts = opts || {};
    this.showHeaders = true;
    this.cwd = process.cwd();
    this.scriptArgs = process.argv.slice(3);
    this.skipEnvironmentalSetup = false;
    this._logger = new Logger({ isQuiet: false, markdown: true });

    if (!this.opts.strict) {
      // @ts-ignore
      this.constructor.strict = false;
    }

    this.exit = process.exit;
    // @ts-ignore
    process.exit = (exitCode) => {
      if (exitCode === 0) {
        return;
      }

      this.exit(exitCode);
    };
  }

  /**
   * Checks the dir is a Flex plugin
   * @returns {boolean}
   */
  isPluginFolder() {
    return filesExist(join(this.cwd, 'public', 'appConfig.js'));
  }

  /**
   * Gets the package.json
   * @returns {object}
   */
  get pkg() {
    return readJSONFile(this.cwd, 'package.json');
  }

  get pluginsApiToolkit() {
    if (!this._pluginsApiToolkit) {
      throw new TwilioCliError('PluginsApiToolkit is not initialized yet');
    }

    return this._pluginsApiToolkit;
  }

  get pluginsClient() {
    if (!this._pluginsClient) {
      throw new TwilioCliError('PluginsClient is not initialized yet');
    }

    return this._pluginsClient;
  }

  get pluginVersionsClient() {
    if (!this._pluginVersionsClient) {
      throw new TwilioCliError('PluginVersionsClient is not initialized yet');
    }

    return this._pluginVersionsClient;
  }

  get configurationsClient() {
    if (!this._configurationsClient) {
      throw new TwilioCliError('ConfigurationsClient is not initialized yet');
    }

    return this._configurationsClient;
  }

  /**
   * The main run command
   * @returns {Promise<void>}
   */
  async run() {
    await super.run();

    if (!this.isPluginFolder()) {
      throw new Error(`${this.cwd} directory is not a flex plugin directory`);
    }

    const httpClient = new PluginServiceHTTPClient(this.twilioApiClient.username, this.twilioApiClient.password);
    this._pluginsApiToolkit = new PluginsApiToolkit(this.twilioApiClient.username, this.twilioApiClient.password);
    this._pluginsClient = new PluginsClient(httpClient);
    this._pluginVersionsClient = new PluginVersionsClient(httpClient);
    this._configurationsClient = new ConfigurationsClient(httpClient);

    if (!this.skipEnvironmentalSetup) {
      this.setupEnvironment();
    }

    try {
      this._logger.notice(`Using profile **${this.currentProfile.id}** (${this.currentProfile.accountSid})`);
      this._logger.newline();

      await this.doRun();
    } catch (e) {
      if (e instanceof TwilioError) {
        this._logger.error(e.message);
        this.logger.error(e.message);
      } else {
        this._logger.error('Unexpected error occurred');
        this._logger.info(e);
      }

      this.exit(1);
    }
  }

  /**
   * OClif alias for run command
   */
  /* istanbul ignore next */
  async runCommand() {
    return this.run();
  }

  /**
   * Runs a flex-plugin-scripts script
   * @param scriptName  the script name
   * @param argv        arguments to pass to the script
   */
  /* istanbul ignore next */
  async runScript(scriptName: string, argv = this.scriptArgs) {
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    return require(`flex-plugin-scripts/dist/scripts/${scriptName}`).default(...argv);
  }

  /**
   * Setups the environment. This must run after run command
   */
  setupEnvironment() {
    process.env.SKIP_CREDENTIALS_SAVING = 'true';
    process.env.TWILIO_ACCOUNT_SID = this.twilioClient.username;
    process.env.TWILIO_AUTH_TOKEN = this.twilioClient.password;
  }

  /**
   * Abstract class method that each command should extend; this is the actual command that runs once initialization is
   * complete
   * @returns {Promise<void>}
   */
  async doRun() {
    throw new Error('Abstract class method must be implemented');
  }
}