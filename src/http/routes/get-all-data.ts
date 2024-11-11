import { FastifyInstance } from 'fastify'
import { processData } from '@/training/data-processing'
import { getCentralValue } from '@/training/get-central-value'

export async function getAllData(app: FastifyInstance) {
  app.get('/get-all-data', async (_, reply) => {
    const malariaDataframe = await processData('src/training/dataset.csv')
    const malariaDataList = malariaDataframe?.values.map((row: any) => {
      const cases = getCentralValue(row[2])
      const deaths = getCentralValue(row[3])
      const riskLevel = cases > 20000 || deaths > 5000 ? 'Alto' : 'Baixo'
      return {
        country: String(row[0]),
        year: Number(row[1]),
        region: String(row[4]),
        cases,
        deaths,
        riskLevel,
      }
    })

    return reply.status(200).send({ data: malariaDataList })
  })
}
