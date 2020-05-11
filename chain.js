const SHA256 = require('crypto-js/sha256');

/*
 * Interlink class to each other to form a blockchain.
 */
class CryptoBlock {

    /*
     * Initialize its properties
     *
     * index => It’s a unique number that tracks the position of every block in the entire blockchain.
     * timestamp => It keeps a record of the time of occurrence of each completed transaction.
     * data => It provides data about the completed transactions, such as the sender details, 
     *  recipient’s details, and quantity transacted.
     * precedingHash => It points to the hash of the preceding block in the blockchain, 
     *  something important in maintaining the blockchain’s integrity. 
     * 
     */
    constructor(index, timestamp, data, precedingHash=" ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    }

    /* 
     * Method to calculate the hash of the block 
     * based on its properties.
     *
     */
    computeHash() {
        return SHA256(
            this.index + 
            this.precedingHash + 
            this.timestamp + 
            JSON.stringify(this.data) + 
            this.nonce
        ).toString();
    }

    /*
     * Method to identifies a number, passed as a difficulty property, such that the hash of every block contains 
     *  leading zeros that correspond to this difficulty level.
     * Ensuring the hash of every block begins with the number of zeros as set in the difficulty level requires a lot of computing power. 
     *  The higher the difficulty level, the more time it takes to mine new blocks.
     * I’ll add a random nonce value to every hashed block such that, when rehashing takes place, the difficulty level 
     *  restrictions can still be met.
     */
    proofOfWork(difficulty) {
        while(
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
}

/*
 * Class that will be responsible for handling the operations of the entire chain. 
 */
class CryptoBlockchain {

    /*
     * Instantiates the blockchain.
     * Refers to an array of blocks and add the initial block in the chain.
     *
     */
    constructor() {
        this.blockchain = [
            this.startGenesisBlock()
        ];
        this.difficulty = 4;
    }

    /*
     * The genesis block refers to the first-ever block create on the network.
     * It should reference the preceding block.
     * It has index of "0" because it does not have any preceding block to point to.
     *
     */
    startGenesisBlock() {
        return new CryptoBlock(
            0,
            "01/01/2020",
            "Initial Block in the Chain",
            "0"
        );
    }

    /*
     * Getting the latest block in the blockchain assistis in ensuring the hash of the
     *  current block points to the hash of the previous block.
     * Thus maintaining the chainś integrity/
     *
     */
    obtainLatestBlock() {
        return this.blockchain[
            this.blockchain.length - 1
        ];
    }

    /*
     * Add a new block to the chain.
     * The previous hash of the new block to be equal to the hash of the last block in the chain.
     *  Thus ensuring the chain is tamper-proof.
     * The properties of the new block get changed with every new calculation,
     *  it's important to calculate its cryptographic hash again.
     * After updating its hash, the new block is pushed into the blockchain array.
     * Adding a new block to a blockchain is not that easy because of the 
     *  several checks that have been placed.
     */
    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        // newBlock.hash = newBlock.computeHash();
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }

    /*
     * This method will verify whether the hash of every black has been tampered.
     * Start from the first created block, it'll loop over the entire bloackchain and check 
     *  for its validity.
     * The method will verify whether the hashes of each two consecutive blocks 
     *  are pointing to one another.
     * If the integrity of the blockchain has not been compromised, it returns true; 
     *  otherwise, in case of any anomalies, it returns false.
     */
    checkChainValidity() {
        for(let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i-1];

            if (currentBlock.hash !== currentBlock.computeHash) {
                return false;
            }

            if (currentBlock.precedingHash !== precedingBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

exports.CryptoBlock = CryptoBlock;
exports.CryptoBlockchain = CryptoBlockchain;
