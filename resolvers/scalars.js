/**
 * This adds a few scalar resolvers for frontend that are also used in prisma
 */

const JSONType = require('graphql-type-json')
const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime
} = require('graphql-custom-types')

module.exports = {
  Json: JSONType,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmail,
  URL: GraphQLURL
}
