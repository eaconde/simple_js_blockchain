const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, transaction, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.hash = this.computeHash();
  }

  computeHash() {
    const jsontransaction = JSON.stringify(this.transaction);
    const message = `${this.index}${this.previousHash}${this.timestamp}${jsontransaction}`
    return SHA256(message).toString();
  }
}

class Blockchain {
  constructor(){
    this.spchain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toLocaleString(), 'Genesis Block', 0);
  }

  getLatestBlock() {
    return this.spchain[this.spchain.length - 1];
  }

  addBlock(transaction) {
    const latestBlock = this.getLatestBlock();
    const index = latestBlock.index + 1;
    const timestamp = new Date().toLocaleString();
    const previousHash = latestBlock.hash;

    const newBlock = new Block(index, timestamp, transaction, previousHash);
    this.spchain.push(newBlock);
  }

  isChainInvalid() {
    return this.spchain.some((currBlock, index) => {
      const prevBlock = this.spchain[index - 1]
      if (prevBlock !== undefined) {
        console.log('currBlock.previousHash :::', currBlock.previousHash);
        console.log('prevBlock.hash :::', prevBlock.hash);
        if (currBlock.previousHash !== prevBlock.hash) { return true };
        if (currBlock.hash !== currBlock.computeHash()) { return true };
        return false;
      }
    });
  }
}

const spcoin = new Blockchain();
spcoin.addBlock({ sender: 'Eric', receiver: 'Altair', amount: '10' });
spcoin.addBlock({ sender: 'Altair', receiver: 'Kevin', amount: '5' });
spcoin.addBlock({ sender: 'Kevin', receiver: 'Eric', amount: '3' });

console.log(JSON.stringify(spcoin, null, 4));
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
// console.log('isChainInvalid? ', spcoin.isChainInvalid());
// ~~~~~~~~~
// Tamper transaction
// const block = spcoin.spchain[2];
// console.log('orig block ::', block.transaction);
// block.transaction = { sender: 'Altair', receiver: 'Kevin', amount: '500' };
// console.log('new block ::', block.transaction);
// console.log('~~~~~~~~');
// block.computeHash();
// console.log('isChainInvalid? ', spcoin.isChainInvalid());

// ~~~~~~~~~
// const block = spcoin.spchain[2];
// block.transaction = { sender: 'Kevin', receiver: 'Eric', amount: '300' };
// block.computeHash();
// console.log('isChainInvalid? ', spcoin.isChainInvalid());
// ~~~~~~~~~
