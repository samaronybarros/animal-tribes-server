import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import { Tribe } from './tribe-model'

const Schema = mongoose.Schema

export interface IWarrior extends mongoose.Document {
  name: string
  warriorname: string
  password: string
  tribe: Tribe
}

const WarriorSchema = new Schema(
  {
    name: { type: String, required: true },
    warriorname: { type: String, required: true },
    password: { type: String, required: true },
    tribe: { type: Tribe, required: false },
  },
  { timestamps: true }
)

WarriorSchema.pre('save', function(next: mongoose.HookNextFunction): void {
  const warrior: any = this

  if (!warrior.password) {
    next()
  }

  bcrypt.genSalt(10, function(err: any, salt: string): void {
    if (err) {
      throw new Error(err)
    } else {
      bcrypt.hash(warrior.password, salt, function(err: any, hashed: string) {
        if (err) {
          return next(err)
        }
        warrior.password = hashed
        next()
      })
    }
  })
})

export default mongoose.model<IWarrior>('Warrior', WarriorSchema)
