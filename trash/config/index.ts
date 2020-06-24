const env = process.env.NODE_ENV || 'development'

type Config = {
  serverUrl: string
  serverPort: number
  serverDatabase: string
  jwtSecret: string
}

const config: Config = require(`./${env}`).default

export default config
