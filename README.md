# passport-typeform

[Passport](http://passportjs.org/) strategy for authenticating with [Typeform](https://www.typeform.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Typeform in your Node.js applications.
By plugging into Passport, Typeform authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm install passport-typeform
```

## Usage

#### Create an Application

Before using `passport-typeform`, you must register an application with Typeform.
If you have not already done so, a new application can be created at
[applications](https://admin.typeform.com/account#/section/apps) within
Typeforms's account settings. Your application will be issued a client ID and client
secret, which need to be provided to the strategy. You will also need to
configure a callback URL which matches a route in your application.

#### Configure Strategy

The Typeform authentication strategy authenticates users using a GitHub account
and OAuth 2.0 tokens. The client ID and secret obtained when creating an
application are supplied as options when creating the strategy. The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
GitHub profile. The `verify` callback must call `cb` providing a user to
complete authentication.

```js
var GitHubStrategy = require('passport-typeform').Strategy;

passport.use(
  new TypeformStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/typeform/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ accountId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'typeform'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/typeform', passport.authenticate('typeform'));

app.get(
  '/auth/typeform/callback',
  passport.authenticate('typeform', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications. The example shows how to
authenticate users using Facebook. However, because both Facebook and Typeform
use OAuth 2.0, the code is similar. Simply replace references to Facebook with
corresponding references to Typeform.

## Contributing

#### Tests

The test suite is located in the `test/` directory. All new features are
expected to have corresponding test cases. Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

The test suite covers 100% of the code base. All new feature development is
expected to maintain that level. Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

PassportJS is provided to you as open source, free of charge. The time and
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution. Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods. Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)
