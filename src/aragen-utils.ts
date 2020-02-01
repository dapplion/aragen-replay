import fs from "fs";
import path from "path";
import os from "os";

const blocksRegex = /\!blocks\!\d+/;

interface TxSigned {
  hash: string; // "0x7f6946fd6025bf29db3dce0957cc65ffaaad1ba9a2028d445e3b44ba52e56e57";
  nonce: string; // "0x51";
  from: string; // "0xb4124ceb3451635dacedd11767f004d8a28c6ee7";
  to: string; // "0x32296d9f8fed89658668875dc73cacf87e8888b2";
  value: string; // "0x0";
  gas: string; // "0x16de17";
  gasPrice: string; // "0x77359400";
  data: string; // "32ab6af000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000b4124ceb3451635dacedd11767f004d8a28c6ee7000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fe18bcbedd6f46e0dfbb3aea02090f23ed1c4a280000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000001d66756e6472616973696e672d6d756c74697369672d74656d706c6174650000000000000000000000000000000000000000000000000000000000000000000033697066733a516d53526e794e5372436f46354d6844617a5a70314e73544b505a377a505376525243594732453651715763537100000000000000000000000000";
  v: string; // "0x1b";
  r: string; // "0xce02f7190aafabe591131efba5bd1b40d0f8b8235d1e0ac36cb8ca2dcad9f599";
  s: string; // "0x69bbdac82d49d6583ffd45d86e75bcb481fc4e03ebea7a2c1757e072f84c1331";
  _type: number; // 1;
}

/**
 * Return the path of the latest aragen db found locally
 * @return aragenPath = "/home/user/.aragon/aragen-db-5.4.2"
 */
function getLatestAragenPath(): string {
  const aragonPath = path.join(os.homedir(), ".aragon");
  const aragonDirs = fs.readdirSync(aragonPath);
  const aragenDirs = aragonDirs.filter(name => name.startsWith("aragen-db-"));
  if (!aragenDirs.length) throw Error(`No aragen-db found in ${aragonPath}`);
  const latestAragen = aragenDirs.sort().reverse()[0];
  return path.join(aragonPath, latestAragen);
}

/**
 * Returns all aragen transactions ordered
 */
export function readTxsFromAragen(): TxSigned[] {
  // Read transactions by block
  const aragenPath = getLatestAragenPath();
  const aragenFiles = fs.readdirSync(aragenPath);

  /**
   * Sample of file names in a ganache-db
   * '!blocks!81'
   * '!blocks!82'
   * '!blocks!9'
   * '!blocks!length'
   * '!transactionReceipts!0x0e145b0a288a603296efe74c64b1684552f563a9368e3797ac4297fbb043f361'
   */
  const blocksFileNames = aragenFiles.filter(name => blocksRegex.test(name));

  const txsByBlock: TxSigned[][] = [];
  for (const blocksFileName of blocksFileNames) {
    const dataString = fs.readFileSync(
      path.join(aragenPath, blocksFileName),
      "utf8"
    );
    const data = JSON.parse(dataString);
    // First block is 0x, returning NaN
    const blockNumber = parseInt(data.header.number, 16) || 0;
    txsByBlock[blockNumber] = data.transactions;
  }

  // Flat txs array
  return flatten(txsByBlock);
}

function flatten<T>(arr: T[][]): T[] {
  const flat: T[] = [];
  for (const x of arr) {
    for (const y of x) {
      flat.push(y);
    }
  }
  return flat;
}
