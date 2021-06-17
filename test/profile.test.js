/* global describe, it, before, expect */
/* jshint expr: true */

var Profile = require('../lib/profile'), fs = require('fs')

describe('Profile.parse', function () {
  describe('profile obtained from /me endpoint', function () {
    var profile

    before(function (done) {
      fs.readFile('test/fixtures/beardyman.json', 'utf8', function (err, data) {
        if (err) {
          return done(err)
        }
        profile = Profile.parse(data)
        done()
      })
    })

    it('should parse profile', function () {
      expect(profile.email).to.equal('beardy@typeform.com')
      expect(profile.language).to.equal('en')
      expect(profile.alias).to.equal('beardyman')
      expect(profile.user_id).to.equal('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      expect(profile.tracking_id).to.equal(123456)
    })
  })
})
