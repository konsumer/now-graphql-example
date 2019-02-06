require('isomorphic-fetch')
const { SchemaDirectiveVisitor } = require('graphql-tools')
const jwt = require('jsonwebtoken')

// get pubkey from auth0 to verify JWT tokens
let authinfo
global.fetch(`https://${process.env.AUTH0_CLIENT_DOMAIN}/.well-known/jwks.json`)
  .then(r => r.json())
  .then(a => { authinfo = a })

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field) {
    const oldResolve = field.resolve
    field.description = `Requires authentication. ${field.description}`
    field.resolve = (obj, args, { req, ...ctx }) => {
      if (!authinfo && !authinfo.keys) {
        throw new Error("Don't have auth0 token for some reason")
      }
      const token = jwt.decode(req.cookies.idToken, { complete: true })
      if (!token) {
        throw new Error('Could not decode token')
      }
      if (token.header.alg !== 'RS256') {
        throw new Error('Invalid algorithm.')
      }
      const sigKey = authinfo.keys.find(k => k.kid === token.header.kid)
      if (!sigKey) {
        throw new Error("Couldn't find signing-key.")
      }
      try {
        const user = jwt.verify(req.cookies.idToken, `-----BEGIN CERTIFICATE-----\n${sigKey.x5c[0]}\n-----END CERTIFICATE-----`, { algorithms: ['RS256'] })
        if (!user) {
          throw new Error()
        }
        return oldResolve.apply(field, [obj, args, { user, ...ctx }])
      } catch (e) {
        throw new Error('Could not verify token.')
      }
    }
  }
}

module.exports = { auth: AuthDirective }
