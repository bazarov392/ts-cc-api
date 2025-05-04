import type { Currency } from "./currency";
import { Network } from "./network";

export interface Balance
{
    currency: Omit<Currency, "network"> & {
        obj_network: Network
    },
    balance_crypto: number,
    balance_usd: number,
    available_balance: number,
    available_balance_usd: number
}