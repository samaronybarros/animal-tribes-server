import { GraphQLError } from 'graphql'

import Skill, { ISkill } from '@local/models/skill-model'
import { skillRules } from '@local/rules/skill-rules'
import { validateToken } from '@local/middlewares/validate-token'

export async function addSkill(
  parent: any,
  args: any,
  { headers }: any
): Promise<ISkill | Error> {
  try {
    const { authorization } = headers
    const warrior = validateToken(authorization)

    skillRules.validate(warrior)

    const LIMIT = 50
    const generateSkill = (): number =>
      Math.floor(Math.random() * LIMIT) + LIMIT

    const skill = new Skill({
      warriorId: warrior.id,
      strength: generateSkill(),
      dexterity: generateSkill(),
      faith: generateSkill(),
      wisdom: generateSkill(),
      magic: generateSkill(),
      agility: generateSkill(),
    })

    return await Skill.create(skill)
  } catch (err) {
    return new GraphQLError(err)
  }
}

export async function updateSkill(
  parent: any,
  args: any,
  { headers }: any
): Promise<ISkill | Error | null> {
  try {
    const { authorization } = headers
    const warrior = validateToken(authorization)

    skillRules.validate(warrior)

    const skill = await Skill.findOne({ warriorId: warrior.id })

    if (!skill) {
      throw new Error('skill does not exists')
    }

    await Skill.findOneAndUpdate(
      { warriorId: warrior.id },
      {
        strength: args.strength || skill.strength,
        dexterity: args.dexterity || skill.dexterity,
        faith: args.faith || skill.faith,
        wisdom: args.wisdom || skill.wisdom,
        magic: args.magic || skill.magic,
        agility: args.agility || skill.agility,
      }
    )

    const skillUpdate: ISkill | null = await Skill.findOne({
      warriorId: warrior.id,
    })

    return skillUpdate
  } catch (err) {
    return new GraphQLError(err)
  }
}
