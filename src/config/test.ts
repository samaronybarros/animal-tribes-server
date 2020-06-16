require('dotenv').config()

const config = {
  serverUrl: 'http://localhost',
  serverPort: 5000,
  serverDatabase: process.env.SERVER_DB_TEST,
  jwtSecret: process.env.JWT_SECRET,
}

export default config
