import { FastifyInstance } from 'fastify'
import { processData } from '@/training/data-processing'
import * as ss from 'simple-statistics'
import {
  getProcessedMalariaData,
  getProcessedMalariaList,
} from '@/training/get-processed-malaria-data'
import { DataFrame } from 'danfojs-node'
import DecisionTree from 'decision-tree'

import { MalariaData } from '@/@types'

async function dataDeathPrediction(
  region?: string,
  country?: string,
  year: number = new Date().getFullYear()
) {
  try {
    const malariaDataframe = await processData('src/training/dataset.csv')
    const malariaLista = await getProcessedMalariaData(
      malariaDataframe as DataFrame,
      region,
      country
    )

    const linearModelCases = ss.linearRegression(
      malariaLista.map((item) => [item.year, item.cases])
    )
    const linearModelDeaths = ss.linearRegression(
      malariaLista.map((item) => [item.year, item.deaths])
    )
    const predictedCases = ss.linearRegressionLine(linearModelCases)(year)
    const predictedDeaths = ss.linearRegressionLine(linearModelDeaths)(year)

    return {
      data: {
        data: malariaLista,
        deaths: {
          message: `Previsão de Mortes para o próximo ano (${year}): ${predictedDeaths}`,
        },
        cases: {
          message: `Previsão de Casos para o próximo ano (${year}): ${predictedCases}`,
        },
      },
    }
  } catch (error) {
    console.log(error)
    return { error }
  }
}
async function startApp() {
  try {
    const testData: Omit<MalariaData, 'riskLevel'> = {
      cases: 20,
      deaths: 20,
      country: 'Algeria',
      region: 'Africa',
      year: 2017,
    }
    const malariaDataframe = await processData('src/training/dataset.csv')
    const { columns, data, target } = await getProcessedMalariaList(
      malariaDataframe as DataFrame
    )
    const dt = new DecisionTree(data, target, columns)
    function predictRisk(data: Omit<MalariaData, 'riskLevel'>): string {
      return dt.predict(data)
    }
    const predictedRisk = predictRisk(testData)
    console.log(`O nível de risco previsto é: ${predictedRisk}`)
    return {
      data: data,
      message: `O nível de risco previsto é: ${predictedRisk}`,
      predictedRisk,
    }
  } catch (error) {
    console.log(error)
    return { error }
  }
}
startApp()

export async function trainingDataSet(app: FastifyInstance) {
  app.post('/train-data', (req, reply) => {})
}
