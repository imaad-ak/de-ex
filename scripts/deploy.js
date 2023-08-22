const { ethers, network } = require("hardhat")

async function main() {
    //Deploying and minting Token 1
    const [deployer, other] = await ethers.getSigners()
    const ERC20Factory = await ethers.getContractFactory("ERC20")
    console.log("Deploying Token1...")
    const Token1 = await ERC20Factory.deploy("Bitcoin", "BTC", "18")
    await Token1.waitForDeployment()

    console.log(`Deployed Token 1 contract to: ${await Token1.getAddress()} `)
    console.log(`Deployer is ${await Token1.i_owner()}`)
    console.log(`Deployer balance is ${await Token1.balanceOf(deployer)}`)
    console.log(`OtherAcc balance is ${await Token1.balanceOf(other)}`)

    await Token1.mint(deployer, "1000")
    await Token1.mint(other, "1000")

    console.log(
        `Deployer balance is ${await Token1.balanceOf(deployer)} after minting`,
    )
    console.log(
        `OtherAcc balance is ${await Token1.balanceOf(other)} after minting`,
    )

    //console.log(Number( await Token1.connect(other).balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") ) )
    //console.log(network.name)

    //Deploying and minting Token 2
    console.log("Deploying Token2...")
    const Token2 = await ERC20Factory.deploy("Ethereum", "ETH", "18")
    await Token2.waitForDeployment()

    console.log(`Deployed Token2 contract to: ${await Token2.getAddress()} `)
    console.log(`Deployer is ${await Token2.i_owner()}`)

    console.log(`Deployer balance is ${await Token2.balanceOf(deployer)}`)
    console.log(`OtherAcc balance is ${await Token2.balanceOf(other)}`)

    await Token2.mint(deployer, "500")

    console.log(
        `Deployer balance is ${await Token2.balanceOf(deployer)} after minting`,
    )

    //Deploying CPAMM
    const CPAMMFactory = await ethers.getContractFactory("CPAMM")
    console.log("Deploying CPAMM...")
    const CPAMM = await CPAMMFactory.deploy(Token1, Token2)
    await CPAMM.waitForDeployment()

    console.log(`Deployed CPAMM contract to: ${await CPAMM.getAddress()} `)
    console.log(
        `Token addresses of the tokens in the CPAMM are ${await CPAMM.token0()} and ${await CPAMM.token1()}`,
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
