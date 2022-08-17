// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupplies } from "../../../helper/eth/contracts/alchemica";
import { getTotalSupply } from "../../../helper/eth/subgraphs/alchemica";
import { getContract } from "../../../helper/graphql/alchemica";

type Data = {
    name?: string;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const data = await getSupplies("gltr".toUpperCase());
    if (!data) {
        return res.status(404).json({ error: "not found" });
    }
    // const data = await getTotalSupply(name.toUpperCase());
    res.status(200).json({ name: "gltr".toUpperCase(), ...data });
}
