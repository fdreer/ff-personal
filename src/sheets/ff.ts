import doc from '@/sheets/index'
import type { Income, Purchase } from '@/types'

export const savePurchases = async (purchases: Purchase[]) => {
    const sheet = doc.sheetsByTitle['TABLA_EGRESOS']

    if (!sheet) {
        throw new Error('No se ha encontrado la hoja "TABLA_EGRESOS"')
    }

    for await (const purchase of purchases) {
        await sheet.addRow({
            FECHA_COMPRA: purchase.shoppingDate,
            CONCEPTO: purchase.concept,
            IMPORTE_TOTAL: purchase.totalAmount,
            CUOTA_NUMERO: purchase.numberQuota,
            MONTO_X_CUOTA: purchase.amountQuota,
            FECHA_PAGO_CUOTA: purchase.payQuotaDate,
            ESTA_PAGO: purchase.isPay
        })
    }

    return
}

export const saveIncome = async (income: Income) => {
    const sheet = doc.sheetsByTitle['TABLA_INGRESOS']

    if (!sheet) {
        throw new Error('No se ha encontrado la hoja "TABLA_INGRESOS"')
    }

    await sheet.addRow({
        FECHA_INGRESO: income.incomeDate,
        CONCEPTO: income.concept,
        IMPORTE_TOTAL: income.totalAmount
    })

    return
}
