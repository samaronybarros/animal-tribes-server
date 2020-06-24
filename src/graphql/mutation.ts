import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

import { WarriorType, SkillType, TokenType } from './types'
import { signup, login, updateTribe } from './resolvers/warrior-resolver'
import { addSkill, updateSkill } from './resolvers/skill-resolver'

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: WarriorType,
      args: {
        name: { type: GraphQLString },
        warriorname: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: signup,
    },
    login: {
      type: TokenType,
      args: {
        warriorname: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: login,
    },
    updateTribe: {
      type: WarriorType,
      args: {
        tribe: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: updateTribe,
    },
    addSkill: {
      type: SkillType,
      resolve: addSkill,
    },
    updateSkill: {
      type: SkillType,
      args: {
        strength: { type: GraphQLInt },
        dexterity: { type: GraphQLInt },
        faith: { type: GraphQLInt },
        wisdom: { type: GraphQLInt },
        magic: { type: GraphQLInt },
        agility: { type: GraphQLInt },
      },
      resolve: updateSkill,
    },
  },
})
