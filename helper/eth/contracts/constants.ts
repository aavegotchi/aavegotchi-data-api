import { Contract, ethers } from "ethers";
import ERC20 from "./abis/ERC20.json";

export const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(
    "https://polygon-rpc.com"
);

export const MAINNET_PROVIDER = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/71e713fa8fa148c8b229b6e34a751005"
);

export enum EthNetwork {
    "mainnet" = "mainnet",
    "polygon" = "polygon",
}

export interface EthProvider {
    mainnet: ethers.providers.JsonRpcProvider;
    polygon: ethers.providers.JsonRpcProvider;
}

export const PROVIDERS: EthProvider = {
    mainnet: MAINNET_PROVIDER,
    polygon: POLYGON_PROVIDER,
};

/**
 * Allowed symbols
 */
export enum TokenSymbol {
    KEK = "kek",
    ALPHA = "alpha",
    FOMO = "fomo",
    FUD = "fud",
    GLTR = "gltr",
    GHST = "ghst",
}

export const ALCHEMICA_SYMBOLS = [];

interface AlchemicaContracts {
    kek: Contract;
    alpha: Contract;
    fomo: Contract;
    fud: Contract;
    gltr: Contract;
}

interface GhstContracts {
    mainnet: Contract;
    polygon: Contract;
}

// tokens held back for vesting are stored in the following addresses
export const VESTING_ADDRESSES: string[] = [
    "0x3fb6c2a83d2fffe94e0b912b612fb100047cc176", // gameplayVesting / pre-mint
    // "0x94cb5c277fcc64c274bd30847f0821077b231022", // aavegotchi multisig
    "0x7e07313b4ff259743c0c84ea3d5e741d2b0d07c3", // pre-mint
    "0xb208f8BB431f580CC4b216826AFfB128cd1431aB", // dao
    "0x1d0360bac7299c86ec8e99d0c1c9a95fefaf2a11", // gp
    "0x1fe64677ab1397e20a1211afae2758570fea1b8c", // gltr staking
    "0xffe6280ae4e864d9af836b562359fd828ece8020", // treasury
    "0xcfd39603a5059f966ca490beb3002a7a57a63233", // pc
];

// if tokens are burned, they are send to the following addresses
export const BURN_ADDRESSES: string[] = [
    "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF",
    "0x0000000000000000000000000000000000000000",
];

export const ALCHEMICA_CONTRACTS: AlchemicaContracts = {
    kek: new Contract(
        "0x42e5e06ef5b90fe15f853f59299fc96259209c5c",
        ERC20,
        POLYGON_PROVIDER
    ),
    alpha: new Contract(
        "0x6a3e7c3c6ef65ee26975b12293ca1aad7e1daed2",
        ERC20,
        POLYGON_PROVIDER
    ),
    fomo: new Contract(
        "0x44a6e0be76e1d9620a7f76588e4509fe4fa8e8c8",
        ERC20,
        POLYGON_PROVIDER
    ),
    fud: new Contract(
        "0x403e967b044d4be25170310157cb1a4bf10bdd0f",
        ERC20,
        POLYGON_PROVIDER
    ),
    gltr: new Contract(
        "0x3801c3b3b5c98f88a9c9005966aa96aa440b9afc",
        ERC20,
        POLYGON_PROVIDER
    ),
};

export const GHST_CONTRACTS: GhstContracts = {
    mainnet: new Contract(
        "0x3f382dbd960e3a9bbceae22651e88158d2791550",
        ERC20,
        MAINNET_PROVIDER
    ),
    polygon: new Contract(
        "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
        ERC20,
        POLYGON_PROVIDER
    ),
};

export const BIGINT_ZERO = ethers.BigNumber.from("0");
