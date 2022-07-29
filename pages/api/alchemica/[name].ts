// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getContract } from "../../../helper/graphql/alchemica";

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

    const contract = await getContract(name);
    res.status(200).json(contract);
}
