// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./CPAMM.sol";

contract CPAMMFactory {
    CPAMM[] public CPAMMArray;

    function createCPAMMContract(address _token0, address _token1) public {
        CPAMM cpammContract = new CPAMM(_token0, _token1);
        CPAMMArray.push(cpammContract);
    }
}
