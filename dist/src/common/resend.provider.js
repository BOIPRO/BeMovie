"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendProvider = exports.RESEND_CLIENT = void 0;
const resend_1 = require("resend");
exports.RESEND_CLIENT = 'RESEND_CLIENT';
exports.ResendProvider = {
    provide: exports.RESEND_CLIENT,
    useFactory: () => {
        return new resend_1.Resend(process.env.RESEND_API_KEY);
    },
};
//# sourceMappingURL=resend.provider.js.map