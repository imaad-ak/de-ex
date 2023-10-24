const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("CPAMM", async function () {
    let ERC20Factory, Token1, Token2, CPAMMObject, Token1Address, Token2Address
    beforeEach(async function () {
        const [deployer, other] = await ethers.getSigners()

        ERC20Factory = await ethers.getContractFactory("ERC20")

        Token1 = await ERC20Factory.deploy("Token1", "TK1", "18")
        await Token1.waitForDeployment()
        await Token1.mint(deployer, "1000")
        await Token1.mint(other, "1000")

        Token2 = await ERC20Factory.deploy("Token2", "TK2", "18")
        await Token2.waitForDeployment()
        await Token2.mint(deployer, "1000")

        Token1Address = await Token1.getAddress()
        Token2Address = await Token2.getAddress()

        const CPAMMFactory = await ethers.getContractFactory("CPAMM")
        CPAMMObject = await CPAMMFactory.deploy(Token1Address, Token2Address)
        await CPAMMObject.waitForDeployment()
    })

    it("Should have right addresses of CPAMM tokens", async function () {
        const tk1Address = await CPAMMObject.token0()
        assert.equal(tk1Address, Token1Address)
        const tk2Address = await CPAMMObject.token1()
        assert.equal(tk2Address, Token2Address)
    })
})
