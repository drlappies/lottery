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

    it("Multiple players can enter the lottery? ", async () => {
        await contract.methods.enterLottery().send({ from: accounts[1], gas: "1000000", value: "10000000000000000" })
        await contract.methods.enterLottery().send({ from: accounts[2], gas: "1000000", value: "10000000000000000" })
        await contract.methods.enterLottery().send({ from: accounts[3], gas: "1000000", value: "10000000000000000" })

        const players = await contract.methods.getPlayers().call({ from: accounts[0] })

        assert.equal(accounts[1], players[0])
        assert.equal(accounts[2], players[1])
        assert.equal(accounts[3], players[2])
        assert.equal(3, players.length)
    })

    it("Contract can generate a random unsigned interger", async () => {
        const rand = await contract.methods.random().call()
        const isRandUint = Number.isInteger(parseInt(rand)) && parseInt(rand) > 0
        assert.equal(isRandUint, true)
    })

    it("Prize pool can receive ether", async () => {
        await contract.methods.enterLottery().send({ from: accounts[1], gas: "1000000", value: "10000000000000000" });
        const contractBalance = await web3.eth.getBalance(contract.options.address)

        const hasContractReceivedEntry = contractBalance === "10000000000000000";
        assert.equal(hasContractReceivedEntry, true)
    })

    it("Is Prize Pool sent out", async () => {
        await contract.methods.enterLottery().send({ from: accounts[1], gas: "1000000", value: "10000000000000000" })
        await contract.methods.pickWinner().send({ from: accounts[0], gas: "1000000" });

        const contractBalance = await web3.eth.getBalance(contract.options.address);

        const isContractPoolClear = contractBalance === "0";
        assert.equal(isContractPoolClear, true)
    })

    it("Is Players reset", async () => {
        await contract.methods.enterLottery().send({ from: accounts[1], gas: "1000000", value: "10000000000000000" })
        await contract.methods.pickWinner().send({ from: accounts[0], gas: "1000000" });
        const players = await contract.methods.getPlayers().call()
        assert.equal(players.length, 0)
    })
})
