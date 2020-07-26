import 'module-alias/register'

import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors'

import schema from './graphql/schema'
import config from './config'

import { connectDb } from './db'

const app = express()
const expressPlayground = require('graphql-playground-middleware-express')
  .default

connectDb()

const corsOptions = {
  origin: config.whitelist,
  optionsSuccessStatus: 200,
}

app.use(cors())

// bind express with graphql
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.get(
  '/playground',
  cors(corsOptions),
  expressPlayground({ endpoint: '/graphql' })
)

app.listen(config.serverPort, () => {
  console.log(`now listening for requests on port ${config.serverPort}`)
})

export default app
