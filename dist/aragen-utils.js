"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var os_1 = __importDefault(require("os"));
var blocksRegex = /\!blocks\!\d+/;
/**
 * Return the path of the latest aragen db found locally
 * @return aragenPath = "/home/user/.aragon/aragen-db-5.4.2"
 */
function getLatestAragenPath() {
    var aragonPath = path_1["default"].join(os_1["default"].homedir(), ".aragon");
    var aragonDirs = fs_1["default"].readdirSync(aragonPath);
    var aragenDirs = aragonDirs.filter(function (name) { return name.startsWith("aragen-db-"); });
    if (!aragenDirs.length)
        throw Error("No aragen-db found in " + aragonPath);
    var latestAragen = aragenDirs.sort().reverse()[0];
    return path_1["default"].join(aragonPath, latestAragen);
}
/**
 * Returns all aragen transactions ordered
 */
function readTxsFromAragen() {
    // Read transactions by block
    var aragenPath = getLatestAragenPath();
    var aragenFiles = fs_1["default"].readdirSync(aragenPath);
    /**
     * Sample of file names in a ganache-db
     * '!blocks!81'
     * '!blocks!82'
     * '!blocks!9'
     * '!blocks!length'
     * '!transactionReceipts!0x0e145b0a288a603296efe74c64b1684552f563a9368e3797ac4297fbb043f361'
     */
    var blocksFileNames = aragenFiles.filter(function (name) { return blocksRegex.test(name); });
    var txsByBlock = [];
    for (var _i = 0, blocksFileNames_1 = blocksFileNames; _i < blocksFileNames_1.length; _i++) {
        var blocksFileName = blocksFileNames_1[_i];
        var dataString = fs_1["default"].readFileSync(path_1["default"].join(aragenPath, blocksFileName), "utf8");
        var data = JSON.parse(dataString);
        // First block is 0x, returning NaN
        var blockNumber = parseInt(data.header.number, 16) || 0;
        txsByBlock[blockNumber] = data.transactions;
    }
    // Flat txs array
    return flatten(txsByBlock);
}
exports.readTxsFromAragen = readTxsFromAragen;
function flatten(arr) {
    var flat = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var x = arr_1[_i];
        for (var _a = 0, x_1 = x; _a < x_1.length; _a++) {
            var y = x_1[_a];
            flat.push(y);
        }
    }
    return flat;
}
