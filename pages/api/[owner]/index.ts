// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupplies } from "../../../helper/eth/contracts/alchemica";
import { getGHSTSupply } from "../../../helper/eth/contracts/ghst";

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
    const { owner } = req.query;
    if (typeof owner != "string") {
        return res
            .status(400)
            .json({ error: "Please provide Token name as string" });
    }

    let data = {};
    if (owner.toLocaleLowerCase() == "ghst") {
        data = await getGHSTSupply();
    } else {
        data = await getSupplies(owner.toUpperCase());
    }

    if (!data) {
        return res.status(404).json({ error: "not found" });
    }
    // const data = await getTotalSupply(name.toUpperCase());
    res.status(200).json({ name: owner.toUpperCase(), ...data });
}
