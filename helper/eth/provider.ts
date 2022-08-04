import { ethers } from "ethers";

export const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-rpc.com"
);
