const { ethers, network } = require("hardhat")
const { expect, assert } = require("chai")

describe("CPAMM", async function () {
    var ERC20Factory,
        Token1,
        Token2,
        CPAMMObject,
        Token1Address,
        Token2Address,
        CPAMMAddress,
        deployer,
        other
    before(async function () {
        ;[deployer, other] = await ethers.getSigners()

        ERC20Factory = await ethers.getContractFactory("ERC20")

        Token1 = await ERC20Factory.deploy("Token1", "TK1", "18")
        await Token1.waitForDeployment()
        await Token1.mint(deployer, "1000000000000000000")
        await Token1.mint(other, "1000000000000000000")

        Token2 = await ERC20Factory.deploy("Token2", "TK2", "18")
        await Token2.waitForDeployment()
        await Token2.mint(deployer, "1000000000000000000")

        Token1Address = await Token1.getAddress()
        Token2Address = await Token2.getAddress()

        const CPAMMFactory = await ethers.getContractFactory("CPAMM")
        CPAMMObject = await CPAMMFactory.deploy(Token1Address, Token2Address)
        await CPAMMObject.waitForDeployment()

        CPAMMAddress = CPAMMObject.getAddress()
    })

    describe("Constructor", async function () {
        it("Should have right addresses of CPAMM tokens", async function () {
            const tk1Address = await CPAMMObject.token0()
            assert.equal(tk1Address, Token1Address)
            const tk2Address = await CPAMMObject.token1()
            assert.equal(tk2Address, Token2Address)
        })

        it("Should have zero total supply", async function () {
            const totalShares = await CPAMMObject.totalSupply()
            const LiquidityProviderShares = await CPAMMObject.balanceOf(
                deployer,
            )

            const expectedValue = "0"
            assert.equal(totalShares.toString(), expectedValue)
            assert.equal(LiquidityProviderShares.toString(), "0")
        })
    })

    describe("addLiquidty", async function () {
        it("Should be able to add liquidity", async function () {
            await Token1.approve(CPAMMAddress, "1000000000")
            await Token2.approve(CPAMMAddress, "500000000")

            await CPAMMObject.addLiquidity("1000000000", "500000000")
            const Token1Reserve = await CPAMMObject.reserve0()
            const Token2Reserve = await CPAMMObject.reserve1()
            const LiquidityProviderShares = await CPAMMObject.balanceOf(
                deployer,
            )
            const expectedValue1 = "1000000000"
            const expectedValue2 = "500000000"

            assert.equal(Token1Reserve.toString(), expectedValue1)
            assert.equal(Token2Reserve.toString(), expectedValue2)
            assert.isAbove(LiquidityProviderShares, 0)
            console.log(LiquidityProviderShares)
        })
        it("Should not be able to add liquidity again if ratio is wrong", async function () {
            await Token1.approve(CPAMMAddress, "1000000000")
            await Token2.approve(CPAMMAddress, "1000000000")
            await expect(
                CPAMMObject.addLiquidity("1000000000", "1000000000"),
            ).to.be.revertedWith("Added liquidity ratio  is not proportional")
        })
    })

    describe("swap", async function () {
        it("Should swap one token for another", async function () {
            await Token1.connect(other).approve(CPAMMAddress, "1000000000")
            const transactionResponse = await CPAMMObject.connect(other).swap(
                Token1,
                "1000000000",
            )
            await transactionResponse.wait(1)
            const SwapperToken2Balance = await Token2.balanceOf(other)

            assert.isAbove(Number(SwapperToken2Balance), 0)
            //console.log(SwapperToken2Balance)
        })
    })

    describe("remove liqudity", async function () {
        it("Should be able to remove liquidity", async function () {
            await CPAMMObject.removeLiquidity("707106781")
        })
    })
})
