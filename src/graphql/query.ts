import * as graphql from 'graphql'

import Warrior from '@local/models/warrior-model'
import Skill from '@local/models/skill-model'
import { WarriorType, SkillType } from './types'
import { validateToken } from '@local/middlewares/validate-token'

const { GraphQLObjectType, GraphQLID, GraphQLList } = graphql

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    warrior: {
      type: WarriorType,
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        const warrior = validateToken(authorization)

        return Warrior.findById(warrior.id)
      },
    },
    opponent: {
      type: SkillType,
      args: { id: { type: GraphQLID } },
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        validateToken(authorization)

        return Skill.findOne({ warriorId: args.id })
      },
    },
    warriors: {
      type: new GraphQLList(WarriorType),
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        validateToken(authorization)
        return Warrior.find()
      },
    },
    opponents: {
      type: new GraphQLList(WarriorType),
      async resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        const warriorInfo = validateToken(authorization)
        const warrior = await Warrior.findById(warriorInfo.id)
        return Warrior.find({ tribe: { $ne: warrior?.tribe } })
      },
    },
    skill: {
      type: SkillType,
      args: { warriorId: { type: GraphQLID } },
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        const warrior = validateToken(authorization)
        return Skill.findOne({ warriorId: warrior.id })
      },
    },
    skills: {
      type: new GraphQLList(SkillType),
      resolve(parent: any, args: any, { headers }: any) {
        const { authorization } = headers
        validateToken(authorization)
        return Skill.find()
      },
    },
  },
})
