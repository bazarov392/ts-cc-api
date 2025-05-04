import type { Network } from "./network"

export interface Currency
{
    id: number
    code: string
    fullcode: string
    network: Network
    name: string
    is_email_required: boolean
    stablecoin: boolean
    icon_base: string
    icon_network: string
    icon_qr: string
    order: number
}