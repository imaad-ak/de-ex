const { ethers, network } = require("hardhat")

async function main() {
    //Deploying and minting Token 1
    const [deployer, other] = await ethers.getSigners()
    const ERC20Factory = await ethers.getContractFactory("ERC20")
    console.log("Deploying Token1...")
    const Token1 = await ERC20Factory.deploy("Token1", "TK1", "18")
    await Token1.waitForDeployment()

    const Token1Symbol = await Token1.symbol()

    console.log(
        `Deployed ${Token1Symbol} contract to: ${await Token1.getAddress()} `,
    )

    console.log(`Deployer is ${await Token1.i_owner()}`)
    console.log(
        `Deployer balance of ${Token1Symbol} is ${await Token1.balanceOf(
            deployer,
        )}`,
    )
    console.log(
        `OtherAcc balance of ${Token1Symbol} is ${await Token1.balanceOf(
            other,
        )}`,
    )

    await Token1.mint(deployer, "1000")
    await Token1.mint(other, "1000")

    console.log(
        `Deployer balance of ${Token1Symbol} is ${await Token1.balanceOf(
            deployer,
        )} after minting`,
    )
    console.log(
        `OtherAcc balance of ${Token1Symbol} is ${await Token1.balanceOf(
            other,
        )} after minting\n`,
    )

    //console.log(Number( await Token1.connect(other).balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") ) )
    //console.log(network.name)

    //Deploying and minting Token 2
    console.log("Deploying Token2...")
    const Token2 = await ERC20Factory.deploy("Token2", "TK2", "18")
    await Token2.waitForDeployment()

    const Token2Symbol = await Token2.symbol()

    console.log(
        `Deployed ${Token2Symbol} contract to: ${await Token2.getAddress()} `,
    )
    console.log(`Deployer is ${await Token2.i_owner()}`)

    console.log(
        `Deployer balance of ${Token2Symbol} is ${await Token2.balanceOf(
            deployer,
        )}`,
    )
    console.log(
        `OtherAcc balance of ${Token2Symbol} is ${await Token2.balanceOf(
            other,
        )}`,
    )

    await Token2.mint(deployer, "500")

    console.log(
        `Deployer balance  of ${Token2Symbol} is ${await Token2.balanceOf(
            deployer,
        )} after minting`,
    )
    console.log(
        `OtherAcc balance  of ${Token2Symbol} is ${await Token2.balanceOf(
            other,
        )} after minting\n`,
    )

    //Deploying and minting Token 3
    console.log("Deploying Token3...")
    const Token3 = await ERC20Factory.deploy("Token3", "TK3", "18")
    await Token3.waitForDeployment()

    const Token3Symbol = await Token3.symbol()

    console.log(
        `Deployed ${Token3Symbol} contract to: ${await Token3.getAddress()} `,
    )
    console.log(`Deployer is ${await Token3.i_owner()}`)

    console.log(
        `Deployer balance of ${Token3Symbol} is ${await Token3.balanceOf(
            deployer,
        )}`,
    )
    console.log(
        `OtherAcc balance of ${Token3Symbol} is ${await Token3.balanceOf(
            other,
        )}`,
    )

    await Token3.mint(deployer, "500")

    console.log(
        `Deployer balance  of ${Token2Symbol} is ${await Token2.balanceOf(
            deployer,
        )} after minting`,
    )
    console.log(
        `OtherAcc balance  of ${Token2Symbol} is ${await Token2.balanceOf(
            other,
        )} after minting\n`,
    )

    //Deploying ContractFactory contract
    const CPAMMFactoryContract = await ethers.getContractFactory("CPAMMFactory")
    console.log("Deploying CPAMM Factory...")
    const CPAMMFactoryObject = await CPAMMFactoryContract.deploy()
    await CPAMMFactoryObject.waitForDeployment()

    Token1Address = await Token1.getAddress()
    Token2Address = await Token2.getAddress()
    Token3Address = await Token3.getAddress()

    //Creating CPAMM Contract 1

    await CPAMMFactoryObject.createCPAMMContract(Token1Address, Token2Address)
    console.log(`CPAMM deployed at ${await CPAMMFactoryObject.CPAMMArray(0)}`)

    //Creating CPAMM Contract 2

    await CPAMMFactoryObject.createCPAMMContract(Token2Address, Token3Address)
    console.log(`CPAMM deployed at ${await CPAMMFactoryObject.CPAMMArray(1)}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
