import { TwilioError } from 'flex-plugins-utils-exception';
export default class TwilioCliError extends TwilioError {
    constructor(msg?: string);
}
