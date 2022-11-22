import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

export const alchemicaSubgraphClient = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-alchemica",
    cache: new InMemoryCache(),
});

const burnAddress = [
    "0xffffffffffffffffffffffffffffffffffffffff",
    // "0x0000000000000000000000000000000000000000",
];

const incentiveWallets = [
    "0x3fb6c2a83d2fffe94e0b912b612fb100047cc176",
    "0x94cb5c277fcc64c274bd30847f0821077b231022",
    "0x7e07313b4ff259743c0c84ea3d5e741d2b0d07c3",
];

export const getTotalSupply = (symbol: String) =>
    alchemicaSubgraphClient
        .query({
            query: gql`
                query ($accounts: [String], $symbol: String) {
                    erc20Contracts(where: { symbol: $symbol }) {
                        id
                        symbol
                        totalSupply {
                            value
                            valueExact
                        }
                    }
                    erc20Balances(where: { account_in: $accounts }) {
                        contract {
                            symbol
                        }
                        account {
                            id
                        }
                        value
                        valueExact
                    }
                }
            `,
            variables: {
                accounts: burnAddress.concat(
                    incentiveWallets.map((e) => e.toLowerCase())
                ),
                symbol: symbol,
            },
        })
        .then((result) => {
            return result.data.erc20Contracts.map((e: any) => {
                const data = {
                    symbol: e.symbol,
                    totalSupply: "0",
                    totalSupplyDecimal: 0,
                    totalSupplyRaw: 0,
                    // burned: parseFloat(e.burned.)
                };

                let totalSupply = BigNumber.from(e.totalSupply.valueExact);

                let circulatingSupply = BigNumber.from(
                    e.totalSupply.valueExact
                );

                // subtract incentivez from circulation
                let incentivez = BigNumber.from("0");
                result.data.erc20Balances
                    .filter((b: any) => {
                        return (
                            b.contract.symbol === symbol.toUpperCase() &&
                            incentiveWallets.indexOf(b.account.id) !== -1
                        );
                    })
                    .forEach((b: any) => {
                        circulatingSupply = circulatingSupply.sub(b.valueExact);
                        incentivez = incentivez.add(b.valueExact);
                    });

                let burnedAmount = BigNumber.from("0");
                result.data.erc20Balances
                    .filter((b: any) => {
                        return (
                            b.contract.symbol === symbol.toUpperCase() &&
                            burnAddress.indexOf(b.account.id) !== -1
                        );
                    })
                    .forEach((b: any) => {
                        totalSupply = totalSupply.sub(
                            BigNumber.from(b.valueExact)
                        );
                        burnedAmount = burnedAmount.add(b.valueExact);
                    });

                return {
                    address: e.id,
                    totalSupply: formatEther(totalSupply),
                    burned: formatEther(burnedAmount),
                    circulatingSupply: formatEther(
                        circulatingSupply.sub(burnedAmount)
                    ),
                };
            })[0];
        });
