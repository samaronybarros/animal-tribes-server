import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'

import Warrior from '@local/models/warrior-model'

export const WarriorType = new GraphQLObjectType({
  name: 'Warrior',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    warriorname: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    tribe: { type: GraphQLString },
  }),
})

export const SkillType = new GraphQLObjectType({
  name: 'Skill',
  fields: () => ({
    id: { type: GraphQLID },
    strength: { type: GraphQLInt },
    dexterity: { type: GraphQLInt },
    faith: { type: GraphQLInt },
    wisdom: { type: GraphQLInt },
    magic: { type: GraphQLInt },
    agility: { type: GraphQLInt },
    warrior: {
      type: new GraphQLNonNull(WarriorType),
      resolve(parent, args) {
        return Warrior.findById(parent.warriorId)
      },
    },
  }),
})

export const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: { type: GraphQLString },
    warrior: { type: WarriorType },
  }),
})
