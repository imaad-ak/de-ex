const { ethers, network, run } = require("hardhat")

async function main() {
    //Deploying and minting Token 1
    const [deployer, other] = await ethers.getSigners()
    const ERC20Factory = await ethers.getContractFactory("ERC20")
    console.log("Deploying Token1...")
    const Token1 = await ERC20Factory.deploy("Token1", "TK1", "18")
    await Token1.waitForDeployment()

    const Token1Symbol = await Token1.symbol()
    const Token1Address = await Token1.getAddress()

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

    await Token1.mint(deployer, "100000")
    await Token1.mint(other, "100000")

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
    const Token2Address = await Token2.getAddress()

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

    await Token2.mint(deployer, "100000")

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

    await Token3.mint(deployer, "100000")

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

    //Deploying CPAMM
    const CPAMMFactory = await ethers.getContractFactory("CPAMM")
    console.log("Deploying CPAMM 1...")
    const CPAMM1 = await CPAMMFactory.deploy(Token1, Token2)
    await CPAMM1.waitForDeployment()
    CPAMM1Address = await CPAMM1.getAddress()

    console.log(`Deployed CPAMM contract to: ${await CPAMM1.getAddress()} `)
    console.log(
        `Token names and addresses of the tokens in the CPAMM are ${Token1Symbol}:${await CPAMM1.token0()} and ${Token2Symbol}:${await CPAMM1.token1()}\n`,
    )

    console.log("Deploying CPAMM 2...")
    const CPAMM2 = await CPAMMFactory.deploy(Token1, Token3)
    await CPAMM2.waitForDeployment()

    console.log(`Deployed CPAMM contract to: ${await CPAMM2.getAddress()} `)
    console.log(
        `Token names and addresses of the tokens in the CPAMM are ${Token1Symbol}:${await CPAMM2.token0()} and ${Token3Symbol}:${await CPAMM2.token1()}\n`,
    )

    console.log("Deploying CPAMM 3...")
    const CPAMM3 = await CPAMMFactory.deploy(Token2, Token3)
    await CPAMM3.waitForDeployment()

    console.log(`Deployed CPAMM contract to: ${await CPAMM3.getAddress()} `)
    console.log(
        `Token names and addresses of the tokens in the CPAMM are ${Token2Symbol}:${await CPAMM3.token0()} and ${Token3Symbol}:${await CPAMM3.token1()}\n`,
    )

    const Token4 = "0x779877A7B0D9E8603169DdbD7836e478b4624789"

    console.log("Deploying CPAMM 4...")
    const CPAMM4 = await CPAMMFactory.deploy(Token1, Token4)
    await CPAMM4.waitForDeployment()

    console.log(`Deployed CPAMM contract to: ${await CPAMM4.getAddress()} `)
    console.log(
        `Token names and addresses of the tokens in the CPAMM are ${Token1Symbol}:${await CPAMM4.token0()} and ${await CPAMM4.token1()}\n`,
    )

    console.log("Deploying CPAMM 5...")
    const CPAMM5 = await CPAMMFactory.deploy(Token2, Token4)
    await CPAMM5.waitForDeployment()

    console.log(`Deployed CPAMM contract to: ${await CPAMM5.getAddress()} `)
    console.log(
        `Token names and addresses of the tokens in the CPAMM are ${Token2Symbol}:${await CPAMM5.token0()} and ${await CPAMM5.token1()}\n`,
    )

    console.log("Deploying CPAMM 6...")
    const CPAMM6 = await CPAMMFactory.deploy(Token3, Token4)
    await CPAMM6.waitForDeployment()

    console.log(`Deployed CPAMM contract to: ${await CPAMM6.getAddress()} `)
    console.log(
        `Token names and addresses of the tokens in the CPAMM are ${Token3Symbol}:${await CPAMM6.token0()} and ${await CPAMM6.token1()}\n`,
    )

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await Token1.deploymentTransaction().wait(6)
        await verify(Token1Address, ["Token1", "TK1", 18])

        await CPAMM1.deploymentTransaction().wait(6)
        await verify(CPAMM1Address, [Token1Address, Token2Address])
    }
}

async function verify(contractAddress, args) {
    console.log("Verifying contract....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else {
            console.log(e)
        }
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
