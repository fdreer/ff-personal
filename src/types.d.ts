export type Purchase = {
    shoppingDate: string
    concept: string
    totalAmount: string
    numberQuota: string
    amountQuota?: string
    payQuotaDate?: string
}

export type PurchaseSheets = {
    [K in keyof Purchase]: string
}

export type Income = {
    incomeDate: string
    concept: string
    totalAmount: string
}
