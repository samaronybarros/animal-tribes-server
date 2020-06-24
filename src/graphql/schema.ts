import { GraphQLSchema } from 'graphql'

import { RootQuery } from './query'
import { Mutation } from './mutation'

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
