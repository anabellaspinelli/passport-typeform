// Load modules.
var OAuth2Strategy = require('passport-oauth2'),
  util = require('util'),
  Profile = require('./profile'),
  InternalOAuthError = require('passport-oauth2').InternalOAuthError,
  APIError = require('./errors/apierror')

const fs = require('fs')
const path = require('path')

/**
 * `Strategy` constructor.
 *
 * The Typeform authentication strategy authenticates requests by delegating to
 * Typeform using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Typeform application's Client ID
 *   - `clientSecret`  your Typeform application's Client Secret
 *   - `callbackURL`   URL to which Typeform will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'user', 'public_repo', 'repo', 'gist', or none.
 *                     (see https://developer.typeform.com/get-started/scopes/ for more info)
 *
 * Examples:
 *
 *     passport.use(new TypeformStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/typeform/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy (options, verify) {
  options = options || {}

  options.authorizationURL =
    options.authorizationURL || 'https://api.typeform.com/oauth/authorize'
  options.tokenURL = options.tokenURL || 'https://api.typeform.com/oauth/token'
  options.scopeSeparator = options.scopeSeparator || ' '
  options.customHeaders = options.customHeaders || {}

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] =
      options.userAgent || 'passport-typeform'
  }

  OAuth2Strategy.call(this, options, verify)

  this.name = 'typeform'
  this._userProfileURL = options.userProfileURL || 'https://api.typeform.com/me'
  this.fetchProfile = options.fetchProfile
  this._oauth2.useAuthorizationHeaderforGET(true)

  this._scope = options.scope || []

  if (!this._skipUserProfile && !this._scope.includes('accounts:read')) {
    console.warn(
      "Scope 'accounts:read' is required to retrieve Typeform basic user profile"
    )
  }
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy)

/**
 * Retrieve user profile from Typeform.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `typeform`
 *   - `alias`            the user's Typeform username
 *   - `email`            the user's email address
 *   - `language`         the user's language setting in Typeform
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data)
        } catch (_) {}
      }

      if (json && json.message) {
        return done(new APIError(json.message))
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err))
    }

    try {
      json = JSON.parse(body)
    } catch (ex) {
      return done(new Error('Failed to parse user profile'))
    }

    var profile = Profile.parse(json)

    profile.provider = 'typeform'
    profile._raw = body
    profile._json = json

    done(null, profile)
  })
}

// Expose constructor.
module.exports = Strategy
