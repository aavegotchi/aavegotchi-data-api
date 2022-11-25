import { Contract } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { mainnetProvider, provider } from "../provider";
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
            return "0x3f382dbd960e3a9bbceae22651e88158d2791550";
        default:
            return "0x0";
    }
};

export const getSupplies = async (symbol: string) => {
    const address = getContractAddress(symbol);
    if (address === "0x0") {
        return false;
    }

    let prov = provider;
    if (symbol == "GHST") {
        prov = mainnetProvider;
    }
    const contract = new Contract(address, ERC20, prov);
    const totalSupply = await contract.totalSupply();

    const burnAddress = [
        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
        "0x0000000000000000000000000000000000000000",
    ];

    const burnBalances = await Promise.all(
        burnAddress.map((e) => contract.balanceOf(e))
    );

    const incentiveWallets = [
        "0x3fb6c2a83d2fffe94e0b912b612fb100047cc176", // gameplayVesting / pre-mint
        "0x94cb5c277fcc64c274bd30847f0821077b231022", // aavegotchi multisig
        "0x7e07313b4ff259743c0c84ea3d5e741d2b0d07c3", // pre-mint
        "0xb208f8BB431f580CC4b216826AFfB128cd1431aB", // dao
        "0x1d0360bac7299c86ec8e99d0c1c9a95fefaf2a11", // gp
        "0x1fe64677ab1397e20a1211afae2758570fea1b8c", // gltr staking
        "0xffe6280ae4e864d9af836b562359fd828ece8020", // treasury
        "0xcfd39603a5059f966ca490beb3002a7a57a63233", // pc
    ];

    const incentiveBalances = await Promise.all(
        incentiveWallets.map((e) => contract.balanceOf(e))
    );

    const incentives = incentiveBalances.reduce((prev, next) =>
        !prev ? next : prev.add(next)
    );

    const burned = burnBalances.reduce((prev, next) =>
        !prev ? next : prev.add(next)
    );

    return {
        address: address,
        totalSupply: formatEther(totalSupply),
        burned: formatEther(burned),
        circulatingSupply: formatEther(totalSupply.sub(burned).sub(incentives)),
    };
};
