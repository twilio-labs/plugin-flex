import { ConfigurationContext, ConfigurationInstance } from 'twilio/lib/rest/flexApi/v1/configuration';
/**
 * Wrapper Twilio Flex Configuration Public API
 */
export default class FlexConfigurationClient {
    private client;
    constructor(client: ConfigurationContext);
    /**
     * Fetches the {@link ConfigurationInstance}
     */
    fetch(): Promise<ConfigurationInstance>;
    /**
     * Fetches the Serverless ServiceSid
     */
    getServerlessSid(): Promise<string | null>;
}
