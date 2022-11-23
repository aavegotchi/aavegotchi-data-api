import { ethers } from "ethers";

export const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-rpc.com"
);

export const mainnetProvider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/71e713fa8fa148c8b229b6e34a751005"
);
