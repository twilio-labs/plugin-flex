import TwilioCliError from './TwilioCliError';
export default class IncompatibleVersionError extends TwilioCliError {
    constructor(name: string, version?: number | null);
}
