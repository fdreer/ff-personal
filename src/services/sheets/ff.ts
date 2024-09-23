import doc from '@/services/sheets/index'
import type { Income, Purchase } from '@/types'

export const savePurchases = async (purchases: Purchase[]) => {
    const purchaseSheet = doc.sheetsByTitle['TABLA_EGRESOS']

    if (!purchaseSheet) {
        throw new Error('No se ha encontrado la hoja "TABLA_EGRESOS"')
    }

    const cotSheet = doc.sheetsByTitle['COTIZACIONES']

    if (!cotSheet) {
        throw new Error('No se ha encontrado la hoja "COTIZACIONES')
    }

    await cotSheet.loadCells('B2:C7')
    const cotBlue = cotSheet.getCellByA1('C5').numberValue as number

    if (purchases.length > 1) {
        for await (const purchase of purchases) {
            await purchaseSheet.addRow({
                FECHA_COMPRA: purchase.shoppingDate,
                CONCEPTO: purchase.concept,
                IMPORTE_TOTAL: purchase.totalAmount,
                IMPORTE_TOTAL_USD: Number(purchase.totalAmount) / cotBlue,
                CUOTA_NUMERO: purchase.numberQuota,
                MONTO_X_CUOTA: purchase.amountQuota,
                FECHA_PAGO_CUOTA: purchase.payQuotaDate,
                ESTA_PAGO: 'NO',
                CONDICION: 'FINANCIADO'
            })
        }

        return
    }

    for await (const purchase of purchases) {
        await purchaseSheet.addRow({
            FECHA_COMPRA: purchase.shoppingDate,
            CONCEPTO: purchase.concept,
            IMPORTE_TOTAL: purchase.totalAmount,
            IMPORTE_TOTAL_USD: Number(purchase.totalAmount) / cotBlue,
            CUOTA_NUMERO: purchase.numberQuota,
            MONTO_X_CUOTA: purchase.amountQuota,
            MONTO_X_CUOTA_USD: Number(purchase.amountQuota) / cotBlue,
            FECHA_PAGO_CUOTA: purchase.payQuotaDate,
            ESTA_PAGO: 'SI',
            COT_USD: cotBlue,
            CONDICION: 'CONTADO'
        })
    }

    return
}

export const saveIncome = async (income: Income) => {
    const sheet = doc.sheetsByTitle['TABLA_INGRESOS']

    if (!sheet) {
        throw new Error('No se ha encontrado la hoja "TABLA_INGRESOS"')
    }

    const cotSheet = doc.sheetsByTitle['COTIZACIONES']

    if (!cotSheet) {
        throw new Error('No se ha encontrado la hoja "COTIZACIONES')
    }

    await cotSheet.loadCells('B2:C7')
    const cotBlue = cotSheet.getCellByA1('C5').numberValue as number

    await sheet.addRow({
        FECHA_INGRESO: income.incomeDate,
        CONCEPTO: income.concept,
        IMPORTE_TOTAL: income.totalAmount,
        IMPORTE_TOTAL_USD: Number(income.totalAmount) / cotBlue,
        ESTA_COBRADO: 'SI',
        COT_USD: cotBlue
    })

    return
}
