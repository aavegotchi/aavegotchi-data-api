import { Contract, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import {
    BIGINT_ZERO,
    BURN_ADDRESSES,
    GHST_CONTRACTS,
    VESTING_ADDRESSES,
} from "./constants";

/**
 * Sums balances in an array
 * @param balances
 * @returns ethers.BigNumber
 */
export const sumBalances = (balances: Array<ethers.BigNumber>) => {
    const sum = balances.reduce((prev, next) =>
        !prev ? next : prev.add(next)
    );

    return sum;
};

/**
 * Fetches and calculates the total and circulating supply
 * @param contract ethers.Contract instance
 * @returns
 */
export const getSupplies = async (
    contract: Contract,
    removeLockedFromCirculating: Boolean = true,
    removeBurnedFromCirculating: Boolean = true,
    format: Boolean = true
) => {
    const totalSupply = await contract.totalSupply();

    // fetch and sum total burned tokens if flag active
    const totalBurned = !removeBurnedFromCirculating
        ? BIGINT_ZERO
        : sumBalances(
              await Promise.all(
                  BURN_ADDRESSES.map((e) => contract.balanceOf(e))
              )
          );

    // fetch and sum total locked tokens if flag active
    const totalLocked = !removeLockedFromCirculating
        ? BIGINT_ZERO
        : sumBalances(
              await Promise.all(
                  VESTING_ADDRESSES.map((e) => contract.balanceOf(e))
              )
          );

    // calculate circulating supply
    const circulatingSupply = totalSupply.sub(totalBurned.add(totalLocked));

    return {
        address: contract.address,
        totalSupply: format ? formatEther(totalSupply) : totalSupply,
        burned: format ? formatEther(totalBurned) : totalBurned,
        circulatingSupply: format
            ? formatEther(circulatingSupply)
            : circulatingSupply,
    };
};

export const getGHSTSupply = async () => {
    const supplies = await Promise.all([
        getSupplies(GHST_CONTRACTS.mainnet, false, true, false),
        getSupplies(GHST_CONTRACTS.polygon, false, true, false),
    ]);

    const mainnet = supplies[0];
    const polygon = supplies[1];

    let burned = BIGINT_ZERO;
    if (ethers.BigNumber.isBigNumber(mainnet.burned)) {
        burned = burned.add(mainnet.burned).add(polygon.burned);
    }

    // totalSupply == circulating Supply
    // need to readd subtracted burned amount
    const totalSupply = mainnet.totalSupply;
    const circulatingSupply = totalSupply.sub(burned);

    return {
        totalSupply: formatEther(totalSupply),
        burned: formatEther(burned),
        circulatingSupply: formatEther(circulatingSupply),
    };
};
