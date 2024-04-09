"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.peekTokenIs = exports.curTokenIs = void 0;
function curTokenIs(parser, token) {
    return parser.curToken.type === token;
}
exports.curTokenIs = curTokenIs;
function peekTokenIs(parser, token) {
    var _a;
    return ((_a = parser.peekToken) === null || _a === void 0 ? void 0 : _a.type) === token;
}
exports.peekTokenIs = peekTokenIs;
