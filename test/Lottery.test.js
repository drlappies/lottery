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

    it("Player can enter the lottery? ", async () => {
        await contract.methods.enterLottery().send({ from: accounts[0], gas: "1000000", value: "10000000000000000" })
        const players = await contract.methods.getPlayers().call()
        const isPlayerJoined = players.includes(accounts[0])
        assert.equal(isPlayerJoined, true)
    })

    it("Contract can generate a random unsigned interger", async () => {
        const rand = await contract.methods.random().call()
        const isRandUint = Number.isInteger(parseInt(rand)) && parseInt(rand) > 0
        assert.equal(isRandUint, true)
    })
})
