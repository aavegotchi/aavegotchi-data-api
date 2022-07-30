export interface ContractResponse {
    address: string;
    name: string;
    symbol: string;
    burned: number;
    totalSupply: number;
    circulationSupply?: number;
}
