import * as _ from 'lodash'

import { Tribe } from '../models/tribe-model'
import Warrior, { IWarrior } from '../models/warrior-model'
import Skill, { ISkill } from '../models/skill-model'

import { connectDb, disconnectDb } from '../db'

export async function createSkill(sequence: number): Promise<ISkill> {
  try {
    const arrTribes = _.values(Tribe)

    const warrior: IWarrior = new Warrior({
      name: `Test ${sequence}`,
      warriorname: `testname${sequence}`,
      password: `testpass${sequence}`,
      tribe: arrTribes[Math.floor(Math.random() * arrTribes.length)],
    })

    await Warrior.create(warrior)

    const skill = new Skill({
      warriorId: warrior.id,
      strength: 10,
      dexterity: 10,
      faith: 10,
      wisdom: 10,
      magic: 10,
      agility: 10,
    })

    return await Skill.create(skill)
  } catch (err) {
    throw new Error(err)
  }
}

const populate = async () => {
  try {
    connectDb()

    for (let i = 1; i <= 100; i++) {
      await createSkill(i)
    }

    disconnectDb()
  } catch (err) {
    throw new Error(err)
  }
}

populate()
