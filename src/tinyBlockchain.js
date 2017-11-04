const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.creategenesisBlock()];
    }

    creategenesisBlock() {
        return new Block(0, "01/01/2017", "genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let coin = new Blockchain();
coin.addBlock(new Block(1, "29/08/2017", { amount: 4 }));
coin.addBlock(new Block(2, "10/09/2017", { amount: 29 }));
coin.addBlock(new Block(3, "11/09/2017", { amount: 6 }));

console.log('---');
console.log('Is blockchain valid? ' + coin.isChainValid());
console.log('---');
console.log('Changing the data of block 1');
coin.chain[1].data = { amount: 30 };
console.log('Is blockchain valid? ' + coin.isChainValid());
console.log('---');
console.log('Recalculating the hash of block 1');
coin.chain[1].hash = coin.chain[1].calculateHash();
console.log('Is blockchain valid? ' + coin.isChainValid());
