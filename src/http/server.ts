import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { deathPreditian } from './routes/death-predition'
import { deathRisk } from './routes/death-risk'
import { getAllData } from './routes/get-all-data'

const app = fastify()

app.register(fastifyCors)
app.register(deathPreditian)
app.register(deathRisk)
app.register(getAllData)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is Running on port http://localhost:3333')
  })
