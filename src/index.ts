import Web3 from "web3";
import { readTxsFromAragen } from "./aragen-utils";

/**
 * Replays all transactions from the latest local aragen instance
 * Use the `run-ganache.sh` script to launch ganache to ensure that
 * - The mnemonic must be the same as the one use in aragen's build
 * - The block gas limit is high enough
 */
async function replay() {
  const web3 = new Web3("http://localhost:8545");

  // Make sure this is a fresh blockchain instance
  const blockNumber = await web3.eth.getBlockNumber();
  if (blockNumber !== 0)
    throw Error(`This must be a fresh EVM instance. Current block is not 0`);

  // Read transactions to broadcast from aragen
  const txs = readTxsFromAragen();

  // Broadcast transactions one by one
  const timeTag = "Total broadcast time";
  console.time(timeTag);
  for (const tx of txs) {
    await web3.eth.sendTransaction({
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      data: tx.data
    });
    // Since all txs are sent by the same account use their nonce as index
    const txIndex = parseInt(tx.nonce, 16);
    console.log(`Broadcasted tx ${txIndex + 1} / ${txs.length}`);
  }
  console.timeEnd(timeTag);
}

replay();
