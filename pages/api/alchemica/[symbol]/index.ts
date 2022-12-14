import type { NextApiRequest, NextApiResponse } from "next";
import {
    ALCHEMICA_CONTRACTS,
    TokenSymbol,
} from "../../../../helper/eth/contracts/constants";
import {
    getGHSTSupply,
    getSupplies,
} from "../../../../helper/eth/contracts/utils";

type Data = {
    symbol?: TokenSymbol;
    name?: TokenSymbol;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { symbol }: Data = req.query;
    console.log(symbol);
    if (typeof symbol != "string") {
        return res
            .status(400)
            .json({ error: "Please provide Token name as string" });
    }

    const data =
        symbol == TokenSymbol.GHST
            ? await getGHSTSupply()
            : await getSupplies(ALCHEMICA_CONTRACTS[symbol]);

    if (!data) {
        return res.status(404).json({ error: "not found" });
    }

    res.status(200).json({ name: symbol, ...data });
}
