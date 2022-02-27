const assert = require("assert")
const ganache = require("ganache")
const Web3 = require("web3")
const { abi, evm } = require("../scripts/compile")

const ganacheConfig = {};
const web3 = new Web3(ganache.provider(ganacheConfig));

let accounts;
let contract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    contract = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: "1000000" })
})

describe("Lottery", () => {
    it("Contract has an address? ", () => {
        assert.ok(contract.options.address)
    })
})
