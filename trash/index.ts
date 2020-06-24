import 'module-alias/register'

import * as express from 'express'
import * as cors from 'cors'

const app = express()

app.use(cors())

app.listen(3333, () => {
  console.log(`now listening for requests on port 3333`)
})

export default app
