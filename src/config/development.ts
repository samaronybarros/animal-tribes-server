require('dotenv').config()

const config = {
  serverUrl: process.env.SERVER_URL,
  serverPort: process.env.SERVER_PORT,
  serverDatabase: process.env.SERVER_DB_DEV,
  jwtSecret: process.env.JWT_SECRET,
}

export default config
