"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upgradePlugin_1 = __importDefault(require("./upgradePlugin"));
const deploy_1 = __importDefault(require("./deploy"));
const release_1 = __importDefault(require("./release"));
exports.default = (logger) => {
    return {
        upgradePlugin: upgradePlugin_1.default(logger),
        deploy: deploy_1.default(logger),
        release: release_1.default(logger),
    };
};
//# sourceMappingURL=index.js.map