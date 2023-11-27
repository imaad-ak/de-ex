const { ethers, network } = require("hardhat")

async function main() {
    //Deploying and minting Token 1
    const [deployer, other] = await ethers.getSigners()
    console.log(deployer)
    console.log(other)
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
    const Token2 = await ERC20Factory.deploy("Token 2", "TK2", "18")
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

    await Token2.mint(deployer, "1000")

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
    console.log("Deploying CPAMM...")
    const CPAMM = await CPAMMFactory.deploy(Token1, Token2)
    await CPAMM.waitForDeployment()

    console.log(`Deployed CPAMM contract to: ${await CPAMM.getAddress()} `)
    console.log(
        `Token names and addresses of the tokens in the CPAMM are ${Token1Symbol}:${await CPAMM.token0()} and ${Token2Symbol}:${await CPAMM.token1()}\n`,
    )

    //Adding liquidity to CPAMM and getting shares
    console.log(
        `No of shares Liquidity Provider has is ${await CPAMM.balanceOf(
            deployer,
        )}`,
    )
    console.log(
        `Reserve of ${Token1Symbol} is ${await CPAMM.reserve0()} before adding liquidity`,
    )
    console.log(
        `Reserve of ${Token2Symbol} is ${await CPAMM.reserve1()} before adding liquidity`,
    )
    console.log(
        `No. of shares in circulation before adding liquidity is ${await CPAMM.totalSupply()}`,
    )

    var transactionResponse
    transactionResponse = await Token1.approve(CPAMM, 500)
    transactionResponse.wait(1)

    transactionResponse = await Token2.approve(CPAMM, 1000)
    transactionResponse.wait(1)

    transactionResponse = await CPAMM.addLiquidity(500, 1000)
    transactionResponse.wait(1)

    console.log(
        `No of shares Liquidity Provider has after adding liquidity ${await CPAMM.balanceOf(
            deployer,
        )}`,
    )
    console.log(
        `Reserve of ${Token1Symbol} is ${await CPAMM.reserve0()} after adding liquidity`,
    )
    console.log(
        `Reserve of ${Token2Symbol} is ${await CPAMM.reserve1()} after adding liquidity`,
    )
    console.log(
        `No. of shares in circulation after adding liquidity is ${await CPAMM.totalSupply()}\n`,
    )

    //Swap Estimate
    swapReturn = await CPAMM.connect(other).calcSwapValue(Token1, "100")
    console.log(
        `For 100 ${Token1Symbol} you will recieve ${swapReturn} of ${Token2Symbol}\n`,
    )

    //Performing Swap
    console.log(
        `OtherAcc balance of ${Token1Symbol} is ${await Token1.balanceOf(
            other,
        )}`,
    )
    console.log(
        `OtherAcc balance of ${Token2Symbol} is ${await Token2.balanceOf(
            other,
        )}`,
    )
    console.log(
        `Reserve of ${Token1Symbol} is ${await CPAMM.reserve0()} before swapping`,
    )
    console.log(
        `Reserve of ${Token2Symbol} is ${await CPAMM.reserve1()} before swapping`,
    )
    await Token1.connect(other).approve(CPAMM, "100")
    await CPAMM.connect(other).swap(Token1, "100")
    console.log("Swapping...")
    console.log(
        `OtherAcc balance of ${Token1Symbol} is ${await Token1.balanceOf(
            other,
        )}`,
    )
    console.log(
        `OtherAcc balance of ${Token2Symbol} is ${await Token2.balanceOf(
            other,
        )}`,
    )
    console.log(
        `Reserve of ${Token1Symbol} is ${await CPAMM.reserve0()} after swapping`,
    )
    console.log(
        `Reserve of ${Token2Symbol} is ${await CPAMM.reserve1()} after swapping\n`,
    )

    //Removing liquidity
    await CPAMM.removeLiquidity("707")
    console.log(
        `Liquidity Provider balance of ${Token1Symbol} is ${await Token1.balanceOf(
            deployer,
        )}`,
    )
    console.log(
        `Liquidity Provider balance of ${Token2Symbol} is ${await Token2.balanceOf(
            deployer,
        )}`,
    )
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations()} confirmations`,
            )
            resolve()
        })
    })
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
