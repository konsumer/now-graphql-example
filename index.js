const schemaDirectives = require('./schemaDirectives')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')

const resolvers = mergeResolvers(fileLoader(`${__dirname}/resolvers/**/*.js`))
const schema = mergeTypes(fileLoader(`${__dirname}/schema/**/*.graphql`), { all: true })

module.exports = {
  schema,
  resolvers,
  schemaDirectives
}

console.log(schema)
