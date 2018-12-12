import * as path from 'path'
import * as allTypes from './resolvers'
import { buildPrismaSchema } from 'nexus-prisma'

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */

export const schema = buildPrismaSchema({
  types: allTypes,

  prisma: {
    schemaPath: path.join(__dirname, './generated/prisma.graphql'),
    contextClientName: 'prisma',
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },

  nullability: {
    input: false,
    inputList: false,
  },

  typegenAutoConfig: {
    sources: [
      {
        module: path.join(__dirname, './generated/prisma-client/index.ts'),
        alias: 'prisma',
      },
      {
        module: path.join(__dirname, './types.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
})
