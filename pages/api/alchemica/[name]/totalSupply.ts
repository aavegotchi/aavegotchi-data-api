// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupplies } from "../../../../helper/eth/contracts/alchemica";
import { getTotalSupply } from "../../../../helper/eth/subgraphs/alchemica";
import { getContract } from "../../../../helper/graphql/alchemica";

type Data = String | Number;

type Query = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { name } = req.query;
    if (typeof name != "string") {
        return res.status(400).json("Please provide Token name as string");
    }

    const data = await getSupplies(name.toUpperCase());
    if (!data) {
        return res.status(404).json("not found");
    }
    // const data = await getTotalSupply(name.toUpperCase());
    res.status(200).json(parseFloat(data.totalSupply));
}
