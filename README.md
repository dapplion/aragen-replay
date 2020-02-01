# Aragen replay

Replays all transactions from the latest local aragen instance. In a standard laptop it takes 14-15 seconds to broadcast its 82 transactions.

## Usage

Clone the repo and install dependencies with

```
npm i
```

Start a local ganache instance.

```
./run-ganache.sh
```

Use the `run-ganache.sh` script to launch ganache to ensure that

- The mnemonic must be the same as the one use in aragen's build
- The block gas limit is high enough

Then, run the node script to replay aragen's transactions

```
node dist
```

**Note**

- You must have a local aragen instance downloaded. If you don't, run

```
aragon devchain
```
