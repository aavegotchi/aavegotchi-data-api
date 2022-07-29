import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    gql,
} from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/id/QmXgUTTY96p8uy6hXSFaNdKivv4xmYaz13qtnSxiiaJLvH",
    cache: new InMemoryCache(),
});

export async function getContract(symbol: string): Promise<any> {
    let query = `{
        
    }`;

    const result = await client.query({
        query: gql`
            query getContract($symbol: String) {
                erc20Contracts(where: { symbol: $symbol }) {
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
        name: e.name,
        symbol: e.symbol,
        burned: e.burned.value,
        totalSupply: e.totalSupply.value,
    }))[0];

    return formattedResult;
}
