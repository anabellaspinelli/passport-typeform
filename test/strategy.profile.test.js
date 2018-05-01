/* global describe, it, before, expect */
/* jshint expr: true */

var TypeformStrategy = require('../lib/strategy')

describe('Strategy#userProfile', function () {
  describe.skip('fetched from default endpoint', function () {
    var strategy = new TypeformStrategy(
      {
        clientID: 'ABC123',
        clientSecret: 'secret',
        scope: ['accounts:read']
      },
      function () {}
    )

    strategy._oauth2.get = function (url, accessToken, callback) {
      if (url != 'https://api.typeform.com/accounts/mine') {
        return callback(new Error('wrong url argument'))
      }
      if (accessToken != 'token') {
        return callback(new Error('wrong token argument'))
      }

      var body =
        '{ "login": "beardyman", "id": 1, "name": "beardy man", "email": "beardy@typeform.com" }'
      callback(null, body, undefined)
    }

    var profile

    before(function (done) {
      strategy.userProfile('token', function (err, p) {
        if (err) {
          return done(err)
        }
        profile = p
        done()
      })
    })

    it('should parse profile', function () {
      expect(profile.provider).to.equal('typeform')

      expect(profile.alias).to.equal('beardyman')
      expect(profile.email).to.equal('beardy@typeform.com')
      expect(profile.language).to.equal('en')
      expect(profile.plan).to.equal('ProPlus1')
    })

    it('should set raw property', function () {
      expect(profile._raw).to.be.a('string')
    })

    it('should set json property', function () {
      expect(profile._json).to.be.an('object')
    })
  }) // fetched from default endpoint

  describe('not fetched due to missing scope', function () {
    var strategy = new TypeformStrategy(
      {
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function () {}
    )

    strategy._oauth2.get = function (url, accessToken, callback) {
      if (url != 'https://api.typeform.com/accounts/mine') {
        return callback(new Error('wrong url argument'))
      }
      if (accessToken != 'token') {
        return callback(new Error('wrong token argument'))
      }
      callback(null, body, undefined)
    }

    var profile

    before(function (done) {
      strategy.userProfile('token', function (err, p) {
        if (err) {
          return done(err)
        }
        profile = p
        done()
      })
    })

    it('should not fetch profile', function () {
      expect(profile).to.be.empty
    })
  }) // not fetched due to missing scopes

  describe('error caused by invalid token', function () {
    var strategy = new TypeformStrategy(
      {
        clientID: 'ABC123',
        clientSecret: 'secret',
        scope: ['accounts:read']
      },
      function () {}
    )

    strategy._oauth2.get = function (url, accessToken, callback) {
      var body =
        '{"message":"Bad credentials","documentation_url":"https://developer.github.com/v3"}'
      callback({ statusCode: 400, data: body })
    }

    var err, profile
    before(function (done) {
      strategy.userProfile('token', function (e, p) {
        err = e
        profile = p
        done()
      })
    })

    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error)
      expect(err.constructor.name).to.equal('APIError')
      expect(err.message).to.equal('Bad credentials')
    })
  }) // error caused by invalid token

  describe('error caused by malformed response', function () {
    var strategy = new TypeformStrategy(
      {
        clientID: 'ABC123',
        clientSecret: 'secret',
        scope: ['accounts:read']
      },
      function () {}
    )

    strategy._oauth2.get = function (url, accessToken, callback) {
      var body = 'Hello, world.'
      callback(null, body, undefined)
    }

    var err, profile
    before(function (done) {
      strategy.userProfile('token', function (e, p) {
        err = e
        profile = p
        done()
      })
    })

    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error)
      expect(err.message).to.equal('Failed to parse user profile')
    })
  }) // error caused by malformed response

  describe('internal error', function () {
    var strategy = new TypeformStrategy(
      {
        clientID: 'ABC123',
        clientSecret: 'secret',
        scope: ['accounts:read']
      },
      function () {}
    )

    strategy._oauth2.get = function (url, accessToken, callback) {
      return callback(new Error('something went wrong'))
    }

    var err, profile

    before(function (done) {
      strategy.userProfile('wrong-token', function (e, p) {
        err = e
        profile = p
        done()
      })
    })

    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error)
      expect(err.constructor.name).to.equal('InternalOAuthError')
      expect(err.message).to.equal('Failed to fetch user profile')
      expect(err.oauthError).to.be.an.instanceOf(Error)
      expect(err.oauthError.message).to.equal('something went wrong')
    })

    it('should not load profile', function () {
      expect(profile).to.be.undefined
    })
  }) // internal error
})
