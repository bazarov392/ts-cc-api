import type { Currency } from "./currency"
import type { Project } from "./project"

export interface CreatedInvoice
{
    uuid: string
    created: string
    address: string
    expiry_date: string
    side_commission: string
    side_commission_service: string
    type_payments: string
    amount: number
    amount_usd: number
    amount_in_fiat: number
    fee: number
    fee_usd: number
    service_fee: number
    service_fee_usd: number
    fiat_currency: string
    status: string
    is_email_required: boolean
    link: string
    invoice_id: string | null
    currency: Currency
    project: Project
    test_mode: boolean
}

export interface Invoice extends CreatedInvoice
{
    type: string
    user_email: string
    pay_url: string
    phone: string
    order_id: string
    amount_in_crypto: number | null
    amount_in_fiat: number
    amount: number
    amount_usd: number
    amount_to_pay: number
    amount_to_pay_usd: number
    amount_paid: number
    amount_paid_usd: number
    fee: number
    fee_usd: number
    service_fee: number
    service_fee_usd: number
    received: number
    received_usd: number
    to_surcharge: number
    to_surcharge_usd: number
}