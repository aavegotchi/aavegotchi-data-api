// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupplies } from "../../../../helper/eth/contracts/alchemica";

type Data = {
    name?: string;
    error?: string;
};

type Query = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { name } = req.query;
    if (typeof name != "string") {
        return res
            .status(400)
            .json({ error: "Please provide Token name as string" });
    }

    const data = await getSupplies(name.toUpperCase());
    if (!data) {
        return res.status(404).json({ error: "not found" });
    }
    // const data = await getTotalSupply(name.toUpperCase());
    res.status(200).json({ name: name.toUpperCase(), ...data });
}
