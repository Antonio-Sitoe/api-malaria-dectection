import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { trainingDataSet } from './routes/training-data'

const app = fastify()

app.register(fastifyCors)
app.register(trainingDataSet)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is Running on port http://localhost:3333')
  })
