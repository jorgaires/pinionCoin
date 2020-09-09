const { CryptoBlock, CryptoBlockchain } = require('./chain');

let pinionCoin = new CryptoBlockchain(difficulty = 5);

console.log("pinionCoin mining in progress...");
pinionCoin.addNewBlock(
    new CryptoBlock(
        1,
        "01/01/2020",
        {
            sender: "Shayan Wilder",
            recipient: "Lukas Bostock",
            quantity: 50
        }
    )
);
pinionCoin.addNewBlock(
    new CryptoBlock(
        2,
        "01/02/2020",
        {
            sender: "Gabrielle Cairns",
            recipient: "Drake Hills",
            quantity: 100
        }
    )
);
console.log(JSON.stringify(pinionCoin, null, 4));
