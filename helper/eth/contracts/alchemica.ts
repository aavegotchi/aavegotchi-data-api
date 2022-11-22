import { Contract } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { provider } from "../provider";
import ERC20 from "./abis/ERC20.json";

const getContractAddress = (symbol: string) => {
    switch (symbol.toLowerCase()) {
        case "kek":
            return "0x42e5e06ef5b90fe15f853f59299fc96259209c5c";
        case "alpha":
            return "0x6a3e7c3c6ef65ee26975b12293ca1aad7e1daed2";
        case "fomo":
            return "0x44a6e0be76e1d9620a7f76588e4509fe4fa8e8c8";
        case "fud":
            return "0x403e967b044d4be25170310157cb1a4bf10bdd0f";
        case "gltr":
            return "0x3801c3b3b5c98f88a9c9005966aa96aa440b9afc";
        case "ghst":
            return "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7";
        default:
            return "0x0";
    }
};

export const getSupplies = async (symbol: string) => {
    const address = getContractAddress(symbol);
    if (address === "0x0") {
        return false;
    }
    const contract = new Contract(address, ERC20, provider);

    const totalSupply = await contract.totalSupply();

    const burnAddress = [
        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
        "0x0000000000000000000000000000000000000000",
    ];

    const burnBalances = await Promise.all(
        burnAddress.map((e) => contract.balanceOf(e))
    );

    const incentiveWallets = [
        "0x3fb6c2a83d2fffe94e0b912b612fb100047cc176",
        "0x94cb5c277fcc64c274bd30847f0821077b231022",
        "0x7e07313b4ff259743c0c84ea3d5e741d2b0d07c3",
        "0xb208f8BB431f580CC4b216826AFfB128cd1431aB",
        "0x1d0360bac7299c86ec8e99d0c1c9a95fefaf2a11",
        "0x1fe64677ab1397e20a1211afae2758570fea1b8c",
    ];

    const incentiveBalances = await Promise.all(
        incentiveWallets.map((e) => contract.balanceOf(e))
    );

    const incentivez = incentiveBalances.reduce((prev, next) =>
        !prev ? next : prev.add(next)
    );

    const circulatingSupply = totalSupply.sub(incentivez);

    const burnedAmount = burnBalances.reduce((prev, next) =>
        !prev ? next : prev.add(next)
    );

    return {
        address: address,
        totalSupply: formatEther(totalSupply),
        burned: formatEther(burnedAmount),
        circulatingSupply: formatEther(circulatingSupply.sub(burnedAmount)),
    };
};
