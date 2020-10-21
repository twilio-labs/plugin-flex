"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper Twilio Flex Configuration Public API
 */
class FlexConfigurationClient {
    constructor(client) {
        this.client = client;
    }
    /**
     * Fetches the {@link ConfigurationInstance}
     */
    async fetch() {
        return this.client.fetch();
    }
    /**
     * Fetches the Serverless ServiceSid
     */
    async getServerlessSid() {
        const config = await this.fetch();
        if (!config.serverlessServiceSids) {
            return null;
        }
        return config.serverlessServiceSids[0];
    }
}
exports.default = FlexConfigurationClient;
//# sourceMappingURL=FlexConfigurationClient.js.map