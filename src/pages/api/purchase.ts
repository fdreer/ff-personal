import { savePurchases } from '@/sheets/ff'
import type { Purchase } from '@/types'
import type { APIRoute } from 'astro'

function calculatePayQuotaDate(baseDate: string, monthsToAdd: number): string {
    const payDate = new Date(baseDate) // Crear una copia de la fecha base
    payDate.setMonth(payDate.getMonth() + monthsToAdd) // Añadir el número de meses
    payDate.setDate(9) // Establecer el día al 10
    return payDate.toISOString().split('T')[0] // Devolver la fecha en formato 'YYYY-MM-DD'
}

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData()
    const concept = data.get('concept') as string
    const shoppingDate = data.get('shoppingDate') as string
    const totalAmount = data.get('totalAmount') as string
    const quotas = Number(data.get('quotas'))

    // TODO: ACÁ DEBERÍAMOS VALIDAR QUE LOS DATOS INGRESADOS ESTÁN BIEN

    if (!concept || !shoppingDate || !totalAmount || !quotas) {
        return new Response(undefined, { status: 400 })
    }

    // TODO:
    // 1. Validar con zod o de otra manera todas las propiedades que se envian del front
    // FECHA_PRIMER_CUOTA = primer dia del mes siguiente a la compra
    // Averiguar cuando se paga la primer cuota. Que dia del mes????

    try {
        // console.time('Save')

        const parsedTotalAmount = Number(totalAmount)
        const amountQuotaValue = (parsedTotalAmount / quotas).toLocaleString(
            'es-ES',
            {
                useGrouping: false
            }
        )

        const purchases: Purchase[] = Array.from(
            { length: quotas },
            (_, i) => ({
                concept,
                shoppingDate,
                totalAmount,
                numberQuota: String(i + 1),
                amountQuota: amountQuotaValue,
                payQuotaDate: calculatePayQuotaDate(shoppingDate, i + 1)
            })
        )

        // console.log(purchases)

        await savePurchases(purchases)
        return new Response(undefined, { status: 201 })

        // console.timeEnd('Save')
    } catch (error) {
        console.log(error)
        return new Response(undefined, { status: 500 })
    }
}
