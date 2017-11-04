const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        //Keep running until first 'difficulty' numbers of the hash is equal to all zeroes 
        //As the difficulty increases (more zeroes must be in front of a hash), the longer it takes to mine the block/calculate the has
        while (this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: ' + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.creategenesisBlock()];
        this.difficulty = 2;
    }

    creategenesisBlock() {
        return new Block(0, "01/01/2017", "genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
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
