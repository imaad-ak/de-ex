// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./IERC20.sol";

contract CPAMM {
    IERC20 public immutable token0;
    IERC20 public immutable token1;

    uint public reserve0;
    uint public reserve1;

    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    function _mint(address _to, uint _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    function _update(uint _reserve0, uint _reserve1) private {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }

    function swap(
        address _tokenIn,
        uint _amountIn
    ) external returns (uint amountOut) {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "Invalid Token"
        );
        require(_amountIn > 0, "Amount in is 0");

        (
            IERC20 tokenIn,
            IERC20 tokenOut,
            uint reserveIn,
            uint reserveOut
        ) = tokenFunc(_tokenIn);

        tokenIn.transferFrom(msg.sender, address(this), _amountIn);

        amountOut = calcAmountOut(_amountIn, reserveIn, reserveOut);

        tokenOut.transfer(msg.sender, amountOut);

        _update(
            token0.balanceOf(address(this)),
            token1.balanceOf(address(this))
        );
    }

    function tokenFunc(
        address _tokenIn
    )
        private
        view
        returns (
            IERC20 tokenIn,
            IERC20 tokenOut,
            uint reserveIn,
            uint reserveOut
        )
    {
        bool isToken0 = _tokenIn == address(token0);
        (tokenIn, tokenOut, reserveIn, reserveOut) = isToken0
            ? (token0, token1, reserve0, reserve1)
            : (token1, token0, reserve1, reserve0);
    }

    function calcAmountOut(
        uint _amountIn,
        uint reserveIn,
        uint reserveOut
    ) private pure returns (uint amountOut) {
        uint amountInWithFee = (_amountIn * 997) / 1000;
        amountOut =
            (reserveOut * amountInWithFee) /
            (reserveIn + amountInWithFee);
    }

    function calcSwapValue(
        address _tokenIn,
        uint _amountIn
    ) public view returns (uint _amountOut) {
        (, , uint reserveIn, uint reserveOut) = tokenFunc(_tokenIn);
        _amountOut = calcAmountOut(_amountIn, reserveIn, reserveOut);
    }

    function addLiquidity(
        uint _amount0,
        uint _amount1
    ) external returns (uint shares) {
        token0.transferFrom(msg.sender, address(this), _amount0);
        token1.transferFrom(msg.sender, address(this), _amount1);

        if (reserve0 > 0 || reserve1 > 0) {
            require(
                reserve0 * _amount1 == reserve1 * _amount0,
                "Added liquidity ratio  is not proportional"
            );
        }

        if (totalSupply == 0) {
            shares = _sqrt(_amount0 * _amount1);
        } else {
            shares = _min(
                ((_amount0 * totalSupply) / reserve0),
                ((_amount1 * totalSupply) / reserve1)
            );
        }
        require(shares > 0, "shares = 0");
        _mint(msg.sender, shares);

        _update(
            token0.balanceOf(address(this)),
            token1.balanceOf(address(this))
        );
    }

    function getLiquidityRatio(
        address _tokenIn,
        uint _amountIn
    ) external view returns (uint _amountOut) {
        (, , uint reserveIn, uint reserveOut) = tokenFunc(_tokenIn);
        _amountOut = (reserveOut * _amountIn) / reserveIn;
    }

    function removeLiquidity(
        uint _shares
    ) external returns (uint amount0, uint amount1) {
        require(_shares > 0, "shares less than 0");

        uint bal0 = token0.balanceOf(address(this));
        uint bal1 = token1.balanceOf(address(this));

        amount0 = (bal0 * _shares) / totalSupply;
        amount1 = (bal1 * _shares) / totalSupply;

        _burn(msg.sender, _shares);

        _update(bal0 - amount0, bal1 - amount1);

        token0.transfer(msg.sender, amount0);
        token1.transfer(msg.sender, amount1);
    }

    function _sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }
}
