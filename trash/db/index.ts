import * as mongoose from 'mongoose'
import config from '../config'

let db: mongoose.Connection

export const connectDb = () => {
  mongoose
    .connect(config.serverDatabase!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .catch((err) => console.log(err))

  db = mongoose.connection
}

export const disconnectDb = () => {
  if (!db) {
    return
  }

  mongoose.disconnect()
}
