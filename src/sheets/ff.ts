import doc from '@/sheets/index'
import type { Purchase } from '@/types'

export const savePurchases = async (purchases: Purchase[]) => {
    const sheet = doc.sheetsByTitle['TABLA_COMPRAS_CUOTAS']

    if (!sheet) {
        throw new Error('No se ha encontrado la hoja "TABLA_COMPRAS_CUOTAS"')
    }

    for await (const purchase of purchases) {
        console.log(purchase)

        // No guarda en el sheets CUOTA_NUMERO y FECHA_PAGO_CUOTA

        await sheet.addRow({
            FECHA_COMPRA: purchase.shoppingDate,
            CONCEPTO: purchase.concept,
            IMPORTE_TOTAL: purchase.totalAmount,
            CUOTA_NUMERO: purchase.numberQuota,
            MONTO_X_CUOTA: purchase.amountQuota,
            FECHA_PAGO_CUOTA: purchase.payQuotaDate
        })
    }

    return
}
