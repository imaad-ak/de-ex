const { ethers } = require("hardhat")

async function main() {
    const ERC20Factory = await ethers.getContractFactory("ERC20")
    console.log("Deploying...")
    const Token1 = await ERC20Factory.deploy("Bitcoin", "BTC", "18")
    await Token1.waitForDeployment()
    console.log(`Deployed contract to: ${await Token1.getAddress()} `)
    await Token1.mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "1000")
    console.log(await Token1.totalSupply())
    console.log(
        await Token1.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
