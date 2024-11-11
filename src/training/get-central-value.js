"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCentralValue = getCentralValue;
function getCentralValue(value) {
    if (typeof value === 'string') {
        const match = value.match(/^(\d+)/);
        if (match) {
            return Number(match[1]);
        }
        return 0;
    }
    return value || 0;
}
