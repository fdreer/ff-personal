import { saveIncome } from '@/sheets/ff'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData()
    const concept = data.get('concept') as string | null
    const incomeDate = data.get('incomeDate') as string | null
    const totalAmount = data.get('totalAmount') as string | null

    if (!concept || !incomeDate || !totalAmount) {
        return new Response(undefined, { status: 400 })
    }

    try {
        // console.time('Save')

        await saveIncome({
            concept,
            incomeDate,
            totalAmount
        })

        // console.timeEnd('Save')
        return new Response(undefined, { status: 201 })
    } catch (error) {
        console.log(error)
        return new Response(undefined, { status: 500 })
    }
}
