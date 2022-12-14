// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
    ALCHEMICA_CONTRACTS,
    TokenSymbol,
} from "../../../../helper/eth/contracts/constants";
import {
    getGHSTSupply,
    getSupplies,
} from "../../../../helper/eth/contracts/utils";

interface Query {
    symbol?: TokenSymbol;
}

type Data = number | string;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { symbol }: Query = req.query;
    if (typeof symbol != "string") {
        return res.status(400).json("Please provide Token name as string");
    }

    const data =
        symbol == TokenSymbol.GHST
            ? await getGHSTSupply()
            : await getSupplies(ALCHEMICA_CONTRACTS[symbol]);

    if (!data) {
        return res.status(500).json("internal server error");
    }

    res.status(200).json(parseFloat(data.totalSupply));
}
