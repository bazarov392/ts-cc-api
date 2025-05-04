
export interface Statistic
{
    count: {
        all: number,
        created: number,
        paid: number,
        overpaid: number,
        partial: number,
        canceled: number
    },
    amount: {
        all: number,
        created: number,
        paid: number,
        overpaid: number,
        partial: number,
        canceled: number
    }
}