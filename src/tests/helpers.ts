import Warrior, { IWarrior } from '@local/models/warrior-model'
import Skill, { ISkill } from '@local/models/skill-model'
import { Tribe } from '@local/models/tribe-model'

export async function clearDB(): Promise<void> {
  await Warrior.deleteMany({})
  await Skill.deleteMany({})
}

export function createWarrior(attrs = {}): Promise<IWarrior> {
  const warrior = new Warrior(
    Object.assign(
      {
        name: 'Test',
        warriorname: 'testname',
        password: 'testpass',
        tribe: Tribe.LION,
      },
      attrs || {}
    )
  )

  return warrior.save()
}

export async function createSkill(attrs = {}): Promise<ISkill> {
  const warrior = new Warrior(
    Object.assign(
      {
        name: 'Test',
        warriorname: 'testname',
        password: 'testpass',
        tribe: Tribe.LION,
      },
      attrs || {}
    )
  )

  await warrior.save()

  const skill = new Skill({
    warriorId: warrior.id,
    strength: 10,
    dexterity: 10,
    faith: 10,
    wisdom: 10,
    magic: 10,
    agility: 10,
  })

  return skill.save()
}
