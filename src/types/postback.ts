
export interface Postback
{
    status: string
    invoice_id: string
    amount_crypto: string
    currency: string
    order_id: string | null
    token: string
    invoice_info: string[]
}