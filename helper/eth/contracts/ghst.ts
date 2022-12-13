import { Contract } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { mainnetProvider, provider } from "../provider";
import ERC20 from "./abis/ERC20.json";

// Hot Wallets
// => "from" = '\x0000000000000000000000000000000000000000'OR "from"='\x2c1a288353e136b9e4b467aadb307133fffeab25' OR "from"='\xc57Feb6d8d5EdfcCe4027C243DCEb2B51b0E318B' OR "from"='\xa0f32863AC0e82d36Df959A95FeDb661C1d32A6f')
// emitted remove to great portal

// Hot Wallets are not of the Circulating Supply
// Same applies GP, PC Studios, DAO and BURN

const getContractAddress = (network: string) => {
    switch (network.toLowerCase()) {
        case "mainnet":
            return "0x3f382dbd960e3a9bbceae22651e88158d2791550";
        default:
            return "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7";
    }
};

const getProvider = (network: string) => {
    switch (network.toLowerCase()) {
        case "mainnet":
            return mainnetProvider;
        default:
            return provider;
    }
};

export const getSupply = async (network: string) => {
    const address = getContractAddress(network);

    const provider = getProvider(network);

    const contract = new Contract(address, ERC20, provider);
    const totalSupply = await contract.totalSupply();

    const burnAddress = [
        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
        "0x0000000000000000000000000000000000000000",
    ];

    const burnBalances = await Promise.all(
        burnAddress.map((e) => contract.balanceOf(e))
    );

    const burned = burnBalances.reduce((prev, next) =>
        !prev ? next : prev.add(next)
    );

    return {
        address: address,
        totalSupply: totalSupply,
        burned: burned,
        circulatingSupply: totalSupply.sub(burned),
    };
};

export const getGHSTSupply = async () => {
    let supplies = await Promise.all([
        getSupply("mainnet"),
        getSupply("matic"),
    ]);

    const mainnet = supplies[0];
    const matic = supplies[1];

    return {
        totalSupply: formatEther(mainnet.totalSupply.add(matic.totalSupply)),
        burned: formatEther(matic.burned.add(mainnet.burned)),
        circulatingSupply: formatEther(
            mainnet.totalSupply
                .add(matic.totalSupply)
                .sub(matic.burned.add(mainnet.burned))
        ),
    };
};
