"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var web3_1 = __importDefault(require("web3"));
var aragen_utils_1 = require("./aragen-utils");
/**
 * Replays all transactions from the latest local aragen instance
 * Use the `run-ganache.sh` script to launch ganache to ensure that
 * - The mnemonic must be the same as the one use in aragen's build
 * - The block gas limit is high enough
 */
function replay() {
    return __awaiter(this, void 0, void 0, function () {
        var web3, blockNumber, txs, timeTag, _i, txs_1, tx, txIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new web3_1["default"]("http://localhost:8545");
                    return [4 /*yield*/, web3.eth.getBlockNumber()];
                case 1:
                    blockNumber = _a.sent();
                    if (blockNumber !== 0)
                        throw Error("This must be a fresh EVM instance. Current block is not 0");
                    txs = aragen_utils_1.readTxsFromAragen();
                    timeTag = "Total broadcast time";
                    console.time(timeTag);
                    _i = 0, txs_1 = txs;
                    _a.label = 2;
                case 2:
                    if (!(_i < txs_1.length)) return [3 /*break*/, 5];
                    tx = txs_1[_i];
                    return [4 /*yield*/, web3.eth.sendTransaction({
                            from: tx.from,
                            to: tx.to,
                            value: tx.value,
                            gas: tx.gas,
                            gasPrice: tx.gasPrice,
                            data: tx.data
                        })];
                case 3:
                    _a.sent();
                    txIndex = parseInt(tx.nonce, 16);
                    console.log("Broadcasted tx " + (txIndex + 1) + " / " + txs.length);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.timeEnd(timeTag);
                    return [2 /*return*/];
            }
        });
    });
}
replay();
