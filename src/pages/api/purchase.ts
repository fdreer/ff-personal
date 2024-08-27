export const prerender = false

import { savePurchases } from '@/services/sheets/ff'
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
    const concept = data.get('concept') as string | null
    const shoppingDate = data.get('shoppingDate') as string | null
    const totalAmount = data.get('totalAmount') as string | null
    const condition = data.get('condition') as string | null

    if (!concept || !shoppingDate || !totalAmount || !condition) {
        return new Response(undefined, { status: 400 })
    }

    try {
        // console.time('Save')
        // CONTADO
        // condition = "contado" y quotas = undefined

        // FINANCIADO
        // condition = "financiado" y quotas = 3, 6, 12
        if (condition === 'financiado') {
            // TODO: deberiamos validar que "quotas sea un número"
            const quotas = Number(data.get('quotas'))

            if (!quotas) {
                return new Response(undefined, { status: 432 })
            }

            const parsedTotalAmount = Number(totalAmount)
            const amountQuotaValue = (
                parsedTotalAmount / quotas
            ).toLocaleString('es-ES', {
                useGrouping: false
            })

            const purchases: Purchase[] = Array.from(
                { length: quotas },
                (_, i) => ({
                    concept,
                    shoppingDate,
                    totalAmount,
                    numberQuota: String(i + 1),
                    amountQuota: amountQuotaValue,
                    payQuotaDate: calculatePayQuotaDate(shoppingDate, i + 1),
                    isPay: 'NO'
                })
            )

            await savePurchases(purchases)
            return new Response(undefined, { status: 201 })
        }

        if (condition === 'contado') {
            // Si condition === "contado", entonces payQuotaDate = shoppingDate

            const purchases: Purchase[] = [
                {
                    concept,
                    shoppingDate,
                    totalAmount,
                    numberQuota: '1',
                    amountQuota: totalAmount,
                    payQuotaDate: shoppingDate,
                    isPay: 'SI'
                }
            ]
            await savePurchases(purchases)
            return new Response(undefined, { status: 201 })
        }

        // console.timeEnd('Save')
        return new Response(undefined, { status: 500 })
    } catch (error) {
        console.log(error)
        return new Response(undefined, { status: 500 })
    }
}
