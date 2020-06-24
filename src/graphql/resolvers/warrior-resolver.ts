import * as _ from 'lodash'
import * as jsonwebtoken from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

import config from '@local/config'
import Warrior, { IWarrior } from '@local/models/warrior-model'
import { signUpRules, loginRules, tribeRules } from '@local/rules/warrior-rules'
import { validateToken } from '@local/middlewares/validate-token'

type LoginResponse = {
  token: string
  warrior: IWarrior | null
}

export async function signup(
  parent: any,
  args: any
): Promise<IWarrior | Error> {
  try {
    await signUpRules.validate(args)

    const warrior = new Warrior({
      name: args.name,
      warriorname: args.warriorname,
      password: args.password,
    })

    return await warrior.save()
  } catch (err) {
    return new GraphQLError(err)
  }
}

export async function login(
  parent: any,
  args: any
): Promise<LoginResponse | Error> {
  try {
    await loginRules.validate(args)

    const warriorname = args.warriorname
    const warrior: IWarrior | null = await Warrior.findOne({ warriorname })

    if (!warrior) {
      return { token: '', warrior: null }
    }

    const token = jsonwebtoken.sign(
      { id: warrior.id, warriorname },
      config.jwtSecret!,
      { expiresIn: '1d' }
    )

    return { token, warrior }
  } catch (err) {
    return new GraphQLError(err)
  }
}

export async function updateTribe(
  parent: any,
  args: any,
  { headers }: any
): Promise<IWarrior | Error | null> {
  try {
    const { authorization } = headers
    const warrior = validateToken(authorization)

    await tribeRules.validate(args)

    await Warrior.findByIdAndUpdate(warrior.id, {
      tribe: args.tribe,
    })

    const warriorUpdate: IWarrior | null = await Warrior.findById(warrior.id)

    return warriorUpdate
  } catch (err) {
    return new GraphQLError(err)
  }
}
