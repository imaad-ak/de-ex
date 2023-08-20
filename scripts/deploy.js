const { ethers } = require("hardhat")

async function main() {
    const ERC20Factory = await ethers.getContractFactory("ERC20")
    console.log("Deploying...")
    const Token1 = await ERC20Factory.deploy("Bitcoin", "BTC", "18")
    await Token1.waitForDeployment()
    Tk1Addr = await Token1.getAddress()
    console.log(`Deployed contract to: ${Tk1Addr} `)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
