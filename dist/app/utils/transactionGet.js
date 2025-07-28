"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionGet = void 0;
const transactionGet = () => {
    // return 'txn_' + (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
    return `tnx_${Date.now()}_${Math.random() * 1000}`;
};
exports.transactionGet = transactionGet;
