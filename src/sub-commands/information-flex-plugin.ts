import { TwilioApiError } from 'flex-plugins-utils-exception';

import FlexPlugin, { ConfigData, SecureStorage } from './flex-plugin';
import { toSentenceCase } from '../utils/strings';

interface IsActive {
  isActive: boolean;
}

/**
 * A helper class for the describe/list methods
 */
export default abstract class InformationFlexPlugin<T> extends FlexPlugin {
  protected static DATE_FIELDS = ['datecreated', 'dateupdated', 'created', 'updated'];

  protected static ACTIVE_FIELDS = ['active', 'isactive', 'status'];

  protected static ACCESS_FIELDS = ['private', 'isprivate'];

  protected constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
  }

  /**
   * Returns the formatted header field
   * @param key
   */
  private static getHeader(key: string) {
    return toSentenceCase(key);
  }

  /**
   * Returns the formatted value field
   * @param key
   * @param value
   */
  private static getValue(key: string, value: string | boolean) {
    key = key.toLowerCase();

    if (InformationFlexPlugin.DATE_FIELDS.includes(key)) {
      return `..!!${value}!!..`;
    }

    if (InformationFlexPlugin.ACTIVE_FIELDS.includes(key)) {
      return value === true ? 'Active' : 'Inactive';
    }
    if (InformationFlexPlugin.ACCESS_FIELDS.includes(key)) {
      return value === true ? 'Private' : 'Public';
    }

    return value as string;
  }

  async doRun() {
    try {
      const resource = await this.getResource();
      if (this.isJson) {
        return resource;
      }

      this.print(resource);
    } catch (e) {
      if (e.instanceOf && e.instanceOf(TwilioApiError)) {
        if ((e as TwilioApiError).status === 404) {
          this.notFound();
          this.exit(1);
          return null;
        }
      }

      throw e;
    }

    return null;
  }

  /**
   * Sorts an array by it's isActive property
   * @param resource
   */
  sortByActive<A extends IsActive>(resource: A[]) {
    const active = resource.find((R) => R.isActive);
    const inactive = resource.filter((R) => !R.isActive);
    const list = [...inactive];
    if (active) {
      list.unshift(active);
    }

    return list;
  }

  /**
   * Prints pretty an object as a Key:Value pair
   * @param object    the object to print
   * @param ignoreList  the keys in the object to ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  printPretty<O extends { [key: string]: any }>(object: O, ...ignoreList: (keyof O)[]) {
    Object.keys(object)
      .filter((key) => !ignoreList.includes(key))
      .forEach((key) => {
        this._logger.info(`..│.. [[${toSentenceCase(key)}]]: ${InformationFlexPlugin.getValue(key, object[key])}`);
      });
  }

  /**
   * Prints the key/value pair as a main header
   * @param key the key
   * @param value the value
   */
  printHeader(key: string, value?: string | boolean) {
    if (value === undefined) {
      this._logger.info(`**[[${InformationFlexPlugin.getHeader(key)}:]]**`);
    } else {
      this._logger.info(
        `**[[${InformationFlexPlugin.getHeader(key)}:]]** ${InformationFlexPlugin.getValue(key, value)}`,
      );
    }
  }

  /**
   * Prints the key/value as a "version" or instance header
   * @param key
   * @param otherKeys
   */
  printVersion(key: string, ...otherKeys: string[]) {
    if (otherKeys.length) {
      this._logger.info(`**++${key}++** ${otherKeys.join('')}`);
    } else {
      this._logger.info(`**++${key}++**`);
    }
  }

  /**
   * Print when the resource is not found
   */
  abstract notFound(): void;

  /**
   * Fetches the resource
   */
  abstract async getResource(): Promise<T>;

  /**
   * Prints the information on the resource
   * @param resource
   */
  abstract print(resource: T): void;
}
