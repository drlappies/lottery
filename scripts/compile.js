const fs = require("fs");
const path = require("path")
const solc = require("solc")

const lotteryPath = path.resolve(__dirname, "../", "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf-8");

const compileConfig = {
    language: "Solidity",
    sources: {
        "Lottery.sol": {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
}

const res = JSON.parse(solc.compile(JSON.stringify(compileConfig))).contracts["Lottery.sol"].Lottery

module.exports = res