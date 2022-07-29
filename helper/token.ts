export function getCirculationSupply(name: string) {
    let symbol = name.toUpperCase();
    let query = `{
        erc20Contracts(where: {symbol:"KEK"}) {
            name
            symbol
            burned {
                value
            }
            totalSupply {
                value
            }
        }
    }`;
}
