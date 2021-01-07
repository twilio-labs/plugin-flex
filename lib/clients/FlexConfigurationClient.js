"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phin_1 = __importDefault(require("phin"));
const exceptions_1 = require("../exceptions");
/**
 * Wrapper Twilio Flex Configuration Public API
 */
class FlexConfigurationClient {
    constructor(client, options) {
        this.client = client;
        this.options = options;
    }
    /**
     * Fetches the {@link ConfigurationInstance}
     */
    async fetch() {
        const config = await this.client.fetch();
        if (!config.serverlessServiceSids) {
            config.serverlessServiceSids = [];
        }
        return config;
    }
    /**
     * Fetches the Serverless ServiceSid
     */
    async getServerlessSid() {
        const config = await this.fetch();
        return config.serverlessServiceSids[0];
    }
    /**
     * Registers Serverless sid
     * @param serviceSid the sid to register
     */
    async registerServerlessSid(serviceSid) {
        const config = await this.fetch();
        if (config.serverlessServiceSids.includes(serviceSid)) {
            return config;
        }
        config.serverlessServiceSids.push(serviceSid);
        await this.updateServerlessSids(config.serverlessServiceSids);
        return this.fetch();
    }
    /**
     * Removes a Serverless sid
     * @param serviceSid the sid to remove
     */
    async unregisterServerlessSid(serviceSid) {
        const config = await this.fetch();
        const index = config.serverlessServiceSids.indexOf(serviceSid);
        if (index === -1) {
            return config;
        }
        config.serverlessServiceSids.splice(index, 1);
        await this.updateServerlessSids(config.serverlessServiceSids);
        return this.fetch();
    }
    /**
     * Updates the serverless sids
     * @param sids  the serverless sid to update
     * @private
     */
    async updateServerlessSids(sids) {
        const auth = Buffer.from(`${this.options.username}:${this.options.password}`, 'utf8').toString('base64');
        // eslint-disable-next-line camelcase
        const data = { account_sid: this.options.accountSid, serverless_service_sids: sids };
        const url = this.options.realm
            ? `https://flex-api.${this.options.realm}.twilio.com/v1/Configuration`
            : 'https://flex-api.twilio.com/v1/Configuration';
        const response = await phin_1.default({
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
            },
            parse: 'json',
            data,
        });
        if (response.statusCode !== 200) {
            throw new exceptions_1.TwilioCliError(response.body);
        }
    }
}
exports.default = FlexConfigurationClient;
//# sourceMappingURL=FlexConfigurationClient.js.map