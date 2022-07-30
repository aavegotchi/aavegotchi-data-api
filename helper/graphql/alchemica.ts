import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    gql,
} from "@apollo/client";
import { ContractResponse } from "../../interfaces/ContractResponse";
import { wallets } from "../constants";

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/id/QmYqKVSmVu9kaVkv9TzrZ5kSKUeVhT85Fu4btis6hu8YYu",
    cache: new InMemoryCache(),
});

export async function getContract(symbol: string): Promise<ContractResponse> {
    const result = await client.query({
        query: gql`
            query getContract($symbol: String) {
                erc20Contracts(where: { symbol: $symbol }) {
                    id
                    name
                    symbol
                    burned {
                        value
                    }
                    totalSupply {
                        value
                    }
                }
            }
        `,
        variables: { symbol: symbol.toUpperCase() },
    });

    let formattedResult = result.data.erc20Contracts.map((e: any) => ({
        address: e.id,
        name: e.name,
        symbol: e.symbol,
        burned: parseFloat(e.burned.value),
        totalSupply: parseFloat(e.totalSupply.value),
    }))[0];

    return getCirculationSupply(formattedResult);
}

export async function getCirculationSupply(
    contract: ContractResponse
): Promise<any> {
    const result = await client.query({
        query: gql`
            query getERC20Balances($contract: String) {
                erc20Balances(
                    where: {
                        account_in: [
                            "0x7e07313b4ff259743c0c84ea3d5e741d2b0d07c3"
                            "0x94cb5c277fcc64c274bd30847f0821077b231022"
                            "0x3fb6c2a83d2fffe94e0b912b612fb100047cc176"
                        ]
                        contract: $contract
                    }
                ) {
                    value
                }
            }
        `,
        variables: { contract: contract.address },
    });

    let circulationSupply: number = contract.totalSupply;
    result.data.erc20Balances.map((e: any) => {
        circulationSupply = circulationSupply - parseFloat(e.value);
    });
    contract.circulationSupply = circulationSupply;
    return contract;
}
