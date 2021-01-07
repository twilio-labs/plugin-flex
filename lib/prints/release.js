"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseSuccessful = void 0;
/**
 * Successful release
 */
exports.releaseSuccessful = (logger) => (configurationSid) => {
    logger.newline();
    logger.success(`🚀 Configuration **${configurationSid}** was successfully enabled.`);
    logger.newline();
    logger.info('**Next Steps:**');
    logger.info('Visit https://flex.twilio.com/admin/plugins to see your plugin(s) live on Flex.');
    logger.newline();
};
exports.default = (logger) => ({
    releaseSuccessful: exports.releaseSuccessful(logger),
});
//# sourceMappingURL=release.js.map